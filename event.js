const express = require('express');
const uuiv1 = require('uuid/v1');

const db = require('./database');

let router = express.Router();

const newEvent = async (request, response) => {
    let uuid = uuiv1();
    let name = await request.body.name;
    let desc = await request.body.desc;
    let date = await request.body.date;

    let con = db.getDb();
    let sql = "INSERT INTO events (event_uuid, eventName, eventDescription, eventDate) VALUES (?, ?, ?, ?)";
    let values = [uuid, name, desc, date];

    con.query(sql, values, (err, result) => {
        if (err) {
            response.send("Unable to create new event");
            return;
        }
        response.redirect("/admin/events");
    });
};

router.post("/newEvent", newEvent);

module.exports = router;