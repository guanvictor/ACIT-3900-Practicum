const port = process.env.PORT || 8080;

// Modules
const express = require("express");
const hbs = require("hbs");
const _ = require("lodash");
const bodyParser = require("body-parser");

// Files
const register = require("./registration.js");
const db = require("./database.js");

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

app.get("/", (request, response) => {
    response.render("home.hbs", {
        title: "Home",
        heading: "Home"
    });
});

// Home Page
app.get('/home', (request, response) => {
    response.render("home.hbs", {
        title:"Home",
        heading: "Home"
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

