const db = require("./database.js");

const express = require("express");
const router = express.Router();
const uuidv1 = require('uuid/v1');

const addSpeaker = async (request, response) => {
    let speaker_id = uuidv1();

    let firstName = await request.body.firstName;
    let lastName = await request.body.lastName;

    let biography = await request.body.biography;
    let topic = await request.body.topic;
    let time = await request.body.time;
    let location = await request.body.location;
    
    let con = db.getDb();

    let sql = "INSERT INTO speakers (speaker_id, firstName, lastName, biography, topic, time, location) VALUES (?, ?, ?, ?, ?, ?, ?)";
    let values = [speaker_id, firstName, lastName, biography, topic, time, location];

    con.query(sql, values, (err, result) => {
        if (err) {
            throw err;
        }
        console.log(`Added new speaker: ${firstName} ${lastName}`);
    });

    return response.redirect("/admin");

    // console.log(request.body);    
};

const getSpeakers = (request, response) => {
    return new Promise((resolve, reject) => {
        let con = db.getDb();

        let sql = "SELECT * FROM speakers";
        
        con.query(sql, (err, result) => {
            if (err) {
                throw err;
            }

            console.log(result);

            response.redirect("/admin");
        });
    });

    // console.log("reached getSpeakers");
};


router.post("/addSpeaker", addSpeaker);
router.post("/getSpeakers", getSpeakers);

module.exports = router;