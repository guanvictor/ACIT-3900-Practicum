const mysql = require("mysql");

var con = null;

var getDb = () => {
    return con;
};

var init = callback => {
    con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "power_engineering_events"
    });

    con.connect(function (err) {
        if (err) {
            return console.log("Unable to connect to MySQL Server.");
        }
        console.log("Successfully connected to MySQL Server!");
    });
};

module.exports = {
    getDb: getDb,
    init: init
};