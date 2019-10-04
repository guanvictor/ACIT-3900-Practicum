const port = process.env.PORT || 8080;

// Modules
const express = require("express");
const hbs = require("hbs");
const _ = require("lodash");
const bodyParser = require("body-parser");
const mariadb = require("mariadb");

// Files
const register = require("./registration.js");

const app = express();

let server = app.listen(port, () => {
    console.log(`Server is up on the port ${port}`);
});

hbs.registerPartials(__dirname + "/views/partials");

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(register);

app.get("/", (request, response) => {
    response.render("registration.hbs", {
        title: "Registration",
        heading: "Registration"
    });
});
