const formidable = require('formidable');
const express = require("express");
const fs = require("fs");

const router = express.Router();
 
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

const deleteFile = async (request, response) => {
    let file_path = await request.body.path;
    
    fs.unlink(file_path, (err) => {
        //TODO: add error
        if (err) console.log(err);
        
        console.log(`${file_path} was deleted`);
    });

    response.redirect('/admin/webcontent/home');
};

router.post("/upload", upload);
router.post("/deleteFile", deleteFile);

module.exports = router;
