const formidable = require('formidable');
const express = require("express");
const fs = require("fs");
const uuidv4 = require('uuid/v4');
const util = require('util');

const db = require("./database.js");

const router = express.Router();

// adds carousel image
// used in admin/webcontent/home
const upload = (request, response) => {
    let form = new formidable.IncomingForm();
    let path = '';
    form.parse(request);

    form.on('field', (name, field) => {
        path = field;
    });

    form.on('fileBegin', (name, file) => {
        let name_split = (file.name).split(/[ ,]+/);
        let file_name = name_split.join('_');

        file.path = path + file_name;
    });

    form.on('file', (name, file) => {
        console.log('Uploaded ' + file.name);
    });

    response.redirect('/admin/webcontent/home');
};

// deletes carousel image
// used in admin/webcontent/home
const deleteFile = async (request, response) => {
    let file_path = await request.body.path;
    
    fs.unlink(file_path, (err) => {
        //TODO: add error
        if (err) console.log(err);
        
        console.log(`${file_path} was deleted`);
    });

    response.redirect('/admin/webcontent/home');
};

// adds speaker image
// used in admin/webcontent/speakers
const uploadSpeaker = (request, response) => {
    let form = new formidable.IncomingForm(),
        value_array = [];
    let uuid = uuidv4();
    let path = './public/images/speakers/';
    let filename = 'default_speaker.png';

    form.parse(request);

    form.on('field', (name, field) => {
        value_array.push(field);
    });
    
    form.on('fileBegin', (name, file) => {
        if (file.name != ''){
            let name_split = (file.name).split(".");
            filename = uuid + "." + name_split[name_split.length - 1];
            file.path = path + filename;
        }
    });

    form.on('end', () => {
        let values = [value_array[1], value_array[0], value_array[2], value_array[4], value_array[3], value_array[5], filename, value_array[6]];
        let con = db.getDb();
        let sql = "UPDATE speakers SET lastName=?, firstName=?, topic=?, time=?, location=?, biography=?, imageName=? WHERE speaker_id=?";

        con.query(sql, values, (err, result) => {
            if (err) throw (err);
        });
    });

    response.redirect('/admin/webcontent/speakers');
};

// updates about event page
// used in admin/webcontent/about
const updateAbout = async (request, response) => {
    let con = db.getDb();
    let sql = '';

    let title = request.body.aboutTitle;
    let date = request.body.aboutDate;
    let timeStart = request.body.about_hr1;
    let timeEnd = request.body.about_hr2;
    let desc = request.body.about_desc;

    //TODO: add if (gmaps is empty), check syntax if not
    let gmaps = request.body.aboutGmaps;


    if (gmaps != '' && gmaps != undefined) {
        //TDOO: check regex
        let regex = /https:[^"]*/;
        let array = regex.exec(gmaps);

        if (array != null){
            let link = array[0];
            sql = "UPDATE about_event SET googleMaps=?";
            con.query(sql, link, (err, result) => {
                if (err) throw (err);

                console.log("Successfully changed Google Maps iFrame");
            });
        }
    }

    sql = "UPDATE about_event SET title=?, date=?, startTime=?, endTime=?, description=?";
    let values = [title, date, timeStart, timeEnd, desc];
    con.query(sql, values, (err, result) => {
        if (err) throw(err);

        console.log("Successfully updated About Event page details");
    });

    response.redirect('/admin/webcontent/about');
};

// updates calendar iFrame
// used in admin/webcontent/calendar

const updateCalendar = async (request, response) => {
    let con = db.getDb();

    let iFrame = request.body.calendariFrame;
    let regex = /https[^"]*/;
    let array = regex.exec(iFrame);

    let sql = "Update calendar SET link=?";

    con.query(sql, array[0], (err, result) => {
        if (err) throw (err);

        console.log("Successfully changed calendar iFrame");
    });
    response.redirect('/admin/webcontent/calendar');
};


router.post("/upload", upload);
router.post("/deleteFile", deleteFile);
router.post("/updateAbout", updateAbout);
router.post("/updateCalendar", updateCalendar);
router.post("/uploadSpeaker", uploadSpeaker);

module.exports = router;
