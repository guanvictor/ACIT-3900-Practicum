const port = process.env.PORT || 8080;

// Modules
const express = require("express");
const hbs = require("hbs");
const _ = require("lodash");
const bodyParser = require("body-parser");

// Files
const register = require("./registration.js");
const db = require("./database.js");
const passport = require("./passport.js");
const queries = require("./queries.js");
const events = require("./event.js");
const profile = require("./profile.js");
const admin = require("./admin.js");
const sendMail = require('./mailgun');

const app = express();

let server = app.listen(port, () => {
    console.log(`Server is up on the port ${port}`);
    db.init();
});

hbs.registerPartials(__dirname + "/views/partials");

app.use(express.static(__dirname + "/public"));
// app.use(express.static(path.join(__dirname + "public")));
app.use('/static', express.static('public'));


app.use(bodyParser.urlencoded({
    extended:true
}));


app.use(express.urlencoded({
    extended: false
}));

app.use(express.json());


app.use(events);
app.use(register);
app.use(passport);
app.use(profile);
app.use(admin);

// Home
app.get("/", async (request, response) => {
    let sponsorFolder = './public/images/index/sponsors';
    let sponsorImgs = await queries.getFiles(sponsorFolder);
    let carouselFolder = './public/images/index/carousel';
    let carouselImgs = await queries.getFiles(carouselFolder);

    response.render("home.hbs", {
        title: "Home",
        heading: "Home",
        sponsorImgs: sponsorImgs,
        carouselImgs: carouselImgs
    });
});

hbs.registerHelper("convertTime", (timeString) => {
    let H = +timeString.substr(0, 2);
    let h = H % 12 || 12;
    let ampm = (H < 12 || H === 24) ? "AM" : "PM";
    timeString = h + timeString.substr(2, 3) + ampm;

    return timeString;
});

hbs.registerHelper("convertDate", (dateString) => {
    let date = new Date(dateString);
    let new_date = date.toDateString();

    return new_date;
})

hbs.registerHelper("setActive", index => {
    if (index == 0) {
        return "active";
    }
    return "";
});

//Checks Authentication (is user logged in?)
checkAuthentication = (request, response, next) => {
    if (request.isAuthenticated()) {
        return next();
    } else {
        response.redirect('/registration');
    }
};

checkAuthentication_false = (request, response, next) => {
    if (!request.isAuthenticated()) {
        return next();
    }
    response.redirect('/');
};

// Login Page
app.get("/login", checkAuthentication_false, (request, response) => {
    let sessionID = request.sessionID;
    let sessionData_string = request.sessionStore.sessions[sessionID];
    let sessionData = JSON.parse(sessionData_string);
    let failureFlag = false;
    let failureMessage = "";

    if (sessionData.flash != undefined) {
        failureFlag = true;
        failureMessage = sessionData.flash.error[0];

        delete sessionData["flash"];
        let deletedError = JSON.stringify(sessionData);
        request.sessionStore.sessions[sessionID] = deletedError;
    }

    response.render("login.hbs", {
        title: "Login",
        heading: "Log In",
        failureFlag: failureFlag,
        failureMessage: failureMessage
    });
});

// Logout
app.get("/logout", checkAuthentication, (request, response) => {
    request.logout();
    request.session.destroy(() => {
        response.clearCookie("connect.sid");
        response.redirect("/");
    });
});

// Profile
app.get("/profile/:account_uuid", checkAuthentication, async (request, response) => {
    if (request.user == undefined) {
        response.render("profile.hbs");
    }

    let user = request.user;

    let profile_uuid = request.params.account_uuid;

    response.render("profile.hbs", {
        profile_uuid: profile_uuid,
        current_uuid: user.account_uuid,

        email: user.email,
        title: user.title,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName,
        division: user.division,
        plantClassification: user.plantClassification,
        fieldPosition: user.fieldPosition,
        businessPhone: user.businessPhone,
        homePhone: user.homePhone,
        cellPhone: user.cellPhone,
        addressL1: user.addressL1,
        addressL2: user.addressL2,
        country: user.country,
        city: user.city,
        province_state: user.province_state,
        pc_zip: user.pc_zip
    });

    hbs.registerHelper("compareUser", (profileUser, currentUser, options) => {
        if (profileUser == currentUser) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
});

//  Page
app.get('/about', async (request, response) => {
    let details = await queries.getRow();

    response.render("about.hbs", {
        title:"About",
        heading: "About",
        details: details

    });
});

// Registration Page
app.get('/registration', checkAuthentication_false, (request, response) => {
    response.render("registration.hbs", {
        title:"Registration",
        heading: "Registration"
    });
});

// Agenda Page
app.get('/agenda', (request, response) => {
    response.render("agenda.hbs", {
        title:"Agenda",
        heading: "Agenda"
    });
});

// Speaker Page
app.get('/speaker', (request, response) => {
    response.render("speakers.hbs", {
        title: "Speaker",
        heading: "Speaker"
    });
});

// Contact Page
app.get('/contact', (request, response) => {
    response.render("contact.hbs", {
        title:"Contact",
        heading: "Contact"
    });
});

// RSVP
app.get("/rsvp", checkAuthentication, async (request, response) => {
    let events = await queries.eventPromise();

    let account_uuid = "";
    if (request.user != undefined) {
        account_uuid = request.user.account_uuid;
    }

    let rsvps = await queries.getRSVPS(account_uuid);
    let event_difference = _.differenceBy(events, rsvps, 'event_uuid');

    response.render("rsvp.hbs", {
        title: "RSVP",
        heading: "Event RSVP",
        event: event_difference,
        account_uuid: account_uuid,
        rsvps: rsvps,
    });
});

//Checks Account Administrator Status
checkAdmin = (request, response, next) => {
    if (request.isAuthenticated()) {
        if (request.user.isadmin == 1) {
            return next();
        }
    } else{
        response.redirect('/');
    }
};

//Admin Page
app.get('/admin', checkAdmin, (request, response) => {
    response.render("administrator/index.hbs", {
        title: "Administrator Panel",
        heading: "Administrator Panel"
    });
});

app.get('/admin/events', checkAdmin, async (request, response) => {
    let events = await queries.eventPromise();

    response.render("administrator/events.hbs", {
        title: "Events",
        heading: "Events",
        event: events,
        event_isActive: true
    });
});

app.get('/admin/events/:event_id', checkAdmin, async (request, response) => {
    let event = await queries.getEvent(request.params.event_id);
    let eventAttendees = await queries.getEventAttendees(request.params.event_id);
    let event_uuid = request.params.event_id;

    let eventDate = await event.eventDate;
    let x = new Date(eventDate);
    let dd = x.getDate();
    let mm = x.getMonth() + 1;
    let yy = x.getFullYear();
    let date = yy + "-" + mm + "-" + dd;
    
    let countAttendees = _.size(eventAttendees);

    response.render("administrator/event.hbs", {
        title: event.eventName,
        heading: event.eventName,
        name: event.eventName,
        date: date,
        desc: event.eventDescription,
        event_isActive: true,
        eventAttendees: eventAttendees,
        countAttendees: countAttendees,
        event_uuid: event_uuid
    });
});

app.get('/admin/webcontent/home', checkAdmin, async (request, response) => {
    let sponsorFolder = './public/images/index/sponsors';
    let sponsorImgs = await queries.getFiles(sponsorFolder);
    let carouselFolder = './public/images/index/carousel';
    let carouselImgs = await queries.getFiles(carouselFolder);
    
    response.render("administrator/webcontent/home.hbs", {
        title: 'Admin - Home',
        heading: 'Manage Home Page Content',
        carouselImgs: carouselImgs,
        sponsorImgs: sponsorImgs,
        webcontent_isActive: true
    });
});

app.get('/admin/webcontent/about', checkAdmin, async (request, response) => {
    let details = await queries.getRow();

    response.render("administrator/webcontent/about.hbs", {
        title: 'Admin - About',
        heading: 'Manage About Page Content',
        webcontent_isActive: true,
        details: details
    });
});
app.get('/admin/webcontent/agenda', checkAdmin, async (request, response) => {
    response.render("administrator/webcontent/agenda.hbs", {
        title: 'Admin - Agenda',
        heading: 'Manage Agenda Page Content',
        webcontent_isActive: true
    });
});
app.get('/admin/webcontent/speakers', checkAdmin, async (request, response) => {
    response.render("administrator/webcontent/speaker.hbs", {
        title: 'Admin - Speaker',
        heading: 'Manage Speaker Page Content',
        webcontent_isActive: true
    });
});
app.get('/admin/webcontent/contact', checkAdmin, async (request, response) => {
    response.render("administrator/webcontent/contact.hbs", {
        title: 'Admin - Contact',
        heading: 'Manage Contact Page Content',
        webcontent_isActive: true
    });
});

app.get('/admin/webcontent', checkAdmin, async (request, response) => {
    response.render("administrator/webcontent.hbs", {
        title: "Website Content",
        heading: "Manage Website Content",
        webcontent_isActive: true
    });
});

app.get('/admin/useraccounts', async (request, response) => {
    response.render("administrator/useraccounts.hbs", {
        title: "User Accounts",
        heading: "Manage User Accounts",
        ua_isActive: true
    });
});

app.get('/admin/adminaccount', async (request, response) => {
    response.render("administrator/adminaccount.hbs", {
        title: "Admin Account",
        heading: "Manage Admin Account",
        adminacc_isActive: true
    });
});

//Contact Form Emails
app.post('/email', (req, res) => {
    const {email, subject, text} = req.body;
    console.log(req.body)

    sendMail(email, subject, text, function(err, data) {
        if (err) {
            res.status(500).json({ message: 'An error has occurred' });
        } else {
            res.json({ message: 'Message sent successfully.'});
        }
    });

});