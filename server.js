const port = process.env.PORT || 8800;

const express = require("express");
const hbs = require("hbs");
const _ = require("lodash");

const app = express();

var server = app.listen(port, () => {
    console.log(`Server is up on the port ${port}`);
});

hbs.registerPartials(__dirname + "/views/partials");

app.use(express.static(__dirname + "/public"));

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

// Contact Page
app.get('/contact', (request, response) => {
    response.render("contact.hbs", {
        title:"Contact",
        heading: "Contact"
    });
});