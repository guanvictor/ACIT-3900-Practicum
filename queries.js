const db = require("./database");

// Populates event table with eventName and date
let eventPromise = () => {
    return new Promise((resolve, reject) => {
        let con = db.getDb();
        let sql = "SELECT * FROM events ORDER BY eventDate";
        
        con.query(sql, (err, result) => {
            if (err) reject (err);
            resolve(result);
        });
        
    });
};

let getEvent = param_id => {
    return new Promise((resolve, reject) => {
        let con = db.getDb();
        let sql = "SELECT * FROM events WHERE event_uuid = ?";
        
        con.query(sql, param_id, (err, result) => {
            if (err) reject (err);
            resolve(result[0]);
        });
    });
};

module.exports = {
    eventPromise: eventPromise,
    getEvent: getEvent
};