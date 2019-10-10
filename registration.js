const express = require("express");
const router = express.Router();

const uuidv1 = require('uuid/v1');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const mysql = require("mysql");
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "power_engineering_events"
});

const registerUser = async (request, response) => {
    let uuid = uuidv1();

    let email = await request.body.email;
    let password = await bcrypt.hash(request.body.password, saltRounds);

    let title = await request.body.title;
    let firstName = await request.body.firstName;
    let lastName = await request.body.lastName;

    let companyName = await request.body.companyName;
    let division = await request.body.division;
    let plantClassification = await request.body.plantClassification;
    let fieldPosition = await request.body.fieldPosition;

    let businessPhone = await request.body.businessPhone;
    let homePhone = await request.body.homePhone;
    let cellPhone = await request.body.cellPhone;

    let addressL1 = await request.body.addressL1;
    let addressL2 = await request.body.addressL2;

    let country = await request.body.country;
    let city = await request.body.city;
    let province_state = await request.body.province_state;
    let pc_zip = await request.body.pc_zip;

    let consent = await request.body.consent;

    try {
        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");

            var sql = "INSERT INTO accounts (account_uuid, email, password, title, firstName, lastName, companyName, division, plantClassification, fieldPosition, businessPhone, homePhone, cellPhone, addressL1, addressL2, country, city, province_state, pc_zip, consent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            var values = [
                uuid,
                email,
                password,
                title,
                firstName,
                lastName,
                companyName,
                division,
                plantClassification,
                fieldPosition,
                businessPhone,
                homePhone,
                cellPhone,
                addressL1,
                addressL2,
                country,
                city,
                province_state,
                pc_zip,
                consent
            ];

            con.query(sql, values, function(err, result){
                if (err) throw err;
                console.log("Number of records inserted: " + result.affectedRows);
            });

        });

    } catch(err) {
        console.log(err);
        throw err;
    }
};

router.post("/registerUser", registerUser);

module.exports = router;
