const express = require("express")
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());

const port = '8080'


var db;

function insertReport(domain, browser, ip, tt, cb) {
    const sql = `INSERT INTO reports (domain, timestamp, browser, ip) VALUES (?, ?, ?, ?)`

    db.run(sql, [domain, tt, browser, ip], function (err) {
        if (err) {
            cb(err, null);
        }
        else {
            cb(null, domain);
        }
    });
}


app.post("/report", (req, res) => {

    const domain = req.body.domain;
    const browser = req.get("User-Agent");
    const ip = req.ip;
    let tt = Math.floor(Date.now() / 1000);

    console.log(domain, browser, ip, tt)

    console.log("am primit raportarea:", domain)
    insertReport(domain, browser, ip, tt, (err, domain) => {
        if (err) {
            console.error("db insert err:", err);
            res.send({ status: "error", msg: "error logging report" })
        }
        else {
            console.log("new domain added:", domain);
            res.send({ status: "success", msg: "Report received." })
        }
    });

});


function serverInit() {

    db = new sqlite3.Database('./reports.db');

    app.listen(port, () => {
        console.log(`Server is running on port 8080`);
    })
}

serverInit();

/*
async function createDb() {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database('./reports.db', (err) => {
            if (err) {
                console.error("Error opening database:", err.message);
                return reject(err);
            }
            console.log("Connected to the SQLite database.");

            // Use serialize to ensure operations are run in order
            db.serialize(() => { //UNIQUE(domain) la final daca vrei domain unic
                db.run(`CREATE TABLE IF NOT EXISTS reports (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    domain TEXT NOT NULL,
                    timestamp TEXT NOT NULL,
                    browser TEXT,
                    ip TEXT
                )`, (err) => {
                    if (err) {
                        console.error("Error creating table:", err.message);
                        return reject(err);
                    }
                    console.log("Table 'reports' ensured to exist.");
                    resolve();
                });
            });
        });
    });
}

createDb()
*/