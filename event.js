const express = require('express');
const uuiv1 = require('uuid/v1');
const _ = require('lodash');

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

const eventRSVP = async (request, response) => {
    let rsvps = request.body.event_uuids;

    if (typeof rsvps === "string") {
        rsvps = [rsvps];
    }

    console.log(rsvps);

    let account_uuid = request.body.account_uuid;

    let con = db.getDb();
    let sql = '';
    let values = [];
    let failure_array = [];

    // console.log(rsvps.length);

    for (let i=0; i<rsvps.length; i++){
        sql = "INSERT INTO UserEventStatus (attendance_uuid, event_uuid, account_uuid) VALUES (?, ?, ?)";
        values = [uuiv1(), rsvps[i], account_uuid];

        con.query(sql, values, (err, result) => {
            if (err){
                console.log(err);
            }
        });
    }

    console.log(failure_array);
};


router.post("/newEvent", newEvent);
router.post("/eventRSVP", eventRSVP);

module.exports = router;