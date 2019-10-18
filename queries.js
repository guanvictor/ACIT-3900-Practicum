const db = require("./database");

// Populates event table with eventName and date
let eventPromise = () => {
    return new Promise((resolve, reject) => {
        let con = db.getDb();
        let sql = "SELECT * FROM events";
        
        con.query(sql, (err, result) => {
            if (err) reject (err);
            resolve(result);
        });
        
    });
};

module.exports = {
    eventPromise: eventPromise
};