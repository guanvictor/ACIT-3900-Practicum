const db = require("./database.js");
const express = require("express");
const router = express.Router();

const editUser = async (request, response) => {
    let email = await request.body.email;

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

    let user_uuid = request.user.account_uuid;

    let con = db.getDb();

    let sql = "UPDATE accounts SET email=?, title=?, firstName=?, lastName=?, companyName=?, division=?, plantClassification=?, fieldPosition=?, businessPhone=?, homePhone=?, cellPhone=?, addressL1=?, addressL2=?, country=?, city=?, province_state=?, pc_zip=? WHERE account_uuid=?";
    let values = [email, title, firstName, lastName, companyName, division, plantClassification, fieldPosition, businessPhone, homePhone, cellPhone, addressL1, addressL2, country, city, province_state, pc_zip, user_uuid];

    con.query(sql, values, (err, result) => {
        if (err) {
            throw err;
        }
        console.log("Successfully updated");
        
        return response.redirect(`/profile/${user_uuid}`);
    });
};

router.post("/editUser", editUser);

module.exports = router;
