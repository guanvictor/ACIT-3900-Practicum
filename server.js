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

app.use(register);
app.use(passport);

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

// Login_2
app.get('/login2', (request, response) => {
    response.render("login2.hbs", {
        title: "Login",
        heading: "Login"
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

//Admin Page
app.get('/admin', (request, response) => {
    response.render("admin.hbs", {
        title: "Admin Panel",
        heading: "Admin Panel"
    });
});

