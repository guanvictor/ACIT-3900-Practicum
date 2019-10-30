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

const app = express();

let server = app.listen(port, () => {
    console.log(`Server is up on the port ${port}`);
    db.init();
});

hbs.registerPartials(__dirname + "/views/partials");

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(events);
app.use(register);
app.use(passport);
app.use(profile);

// Home
app.get("/", (request, response) => {
    response.render("home.hbs", {
        title: "Home",
        heading: "Home"
    });
});

// Login Page
app.get("/login", (request, response) => {
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
app.get("/logout", (request, response) => {
    request.logout();
    request.session.destroy(() => {
        response.clearCookie("connect.sid");
        response.redirect("/");
    });
});

// Profile
app.get("/profile/:account_uuid", async (request, response) => {
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

// About Page
app.get('/about', (request, response) => {
    response.render("about.hbs", {
        title:"About",
        heading: "About"
    });
});

// Registration Page
app.get('/registration', (request, response) => {
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
app.get("/rsvp", async (request, response) => {
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

//Admin Page
app.get('/admin', (request, response) => {
    response.render("administrator/index.hbs", {
        title: "Administrator Panel",
        heading: "Administrator Panel"
    });
});

app.get('/admin/events', async (request, response) => {
    let events = await queries.eventPromise();

    response.render("administrator/events.hbs", {
        title: "Events",
        heading: "Events",
        event: events
    });
});

app.get('/admin/events/:event_id', async (request, response) => {
    let event = await queries.getEvent(request.params.event_id);

    let eventDate = await event.eventDate;

    let x = new Date(eventDate);
    var dd = x.getDate();
    var mm = x.getMonth() + 1;
    var yy = x.getFullYear();
    let date = yy + "-" + mm + "-" + dd;

    response.render("administrator/event.hbs", {
        title: event.eventName,
        heading: event.eventName,
        name: event.eventName,
        date: date,
        desc: event.eventDescription
    });
});