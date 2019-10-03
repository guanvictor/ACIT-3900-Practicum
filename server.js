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
    response.render("registration.hbs", {
        title: "Registration",
        heading: "Registration"
    });
});