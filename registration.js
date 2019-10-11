const express = require("express");
const router = express.Router();

const bcrypt = require('bcryptjs');
const saltRounds = 10;

const mariadb = require("mariadb");
const dbHost = "127.0.0.1";
const pool = mariadb.createPool({
    host: dbHost,
    user: "root",
    password: "password",
    database: "users",
    connectionLimit: 5
});

const registerUser = async (request, response) => {
    let email = await request.body.email;
    let password = await bcrypt.hash(request.body.password, saltRounds);
    let title = await request.body.title;
    let firstName = await request.body.firstName;
    let lastName = await request.body.lastName;
    let companyName = await request.body.companyName;
    let department = await request.body.department;
    let plantLevel = await request.body.plantLevel;
    let primaryPhone = await request.body.primaryPhone;
    let altPhone = await request.body.altPhone;
    let houseAddress = await request.body.houseAddress;
    let city = await request.body.city;
    let province = await request.body.province;

    let conn;

    try {
        conn = await pool.getConnection();

        if (await plantLevel == undefined){
            plantLevel = null;
        }

        if (await province == undefined){
            province = null;
        }
        
        const insert = await conn.query("INSERT INTO users value (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [email, password, title, firstName, lastName, companyName, department, plantLevel, primaryPhone, altPhone, houseAddress, city, province]);
        console.log(insert);

        response.send("Successfully registered.");
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if (conn) return conn.end();
    }
}

router.post("/registerUser", registerUser);

module.exports = router;
