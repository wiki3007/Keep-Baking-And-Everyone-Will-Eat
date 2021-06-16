const express = require("express");
const app = express()
const path = require("path")
const bodyParser = require("body-parser")
const PORT = process.env.PORT || 3000;
var session = require('express-session')
var Datastore = require('nedb')

var coll1 = new Datastore({
    filename: 'ALLTHEINFOBRUH.db',
    autoload: true
});
let tempObj = {}
let cashierReq = {
    id_cashier: null,
    color1: null,
    color2: null,
    color3: null,
    towerLevel: null,
    code: null
}
let bakerRes = {
    id_baker: null,
    color1: null,
    color2: null,
    color3: null,
    towerLevel: null,
    code: null
}
let usersDb = new Datastore({
    filename: "users.db",
    autoload: true
})
var doc = {
    a: "a",
    b: "b"
};
coll1.insert(cashierReq, function (err, cashier) {
    console.log("Dodano dokument (obiekt): " + cashier);
})
coll1.insert(bakerRes, function (err, baker) {
    console.log("Dodano dokument (obiekt): " + baker);
})
coll1.findOne({ _id: 'colourssS' }, function (err, doc) {
    console.log("----- obiekt pobrany z bazy: ", doc)
    console.log("----- formatowanie obiektu JS na format JSON: ")
    console.log(JSON.stringify(doc, null, 5))
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("static"));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.get("/", function (req, res) {
    console.log(req.sessionID);
    res.sendFile(path.join(__dirname + "/static/start.html"));
})

app.post("/gameChoose", function (req, res) {
    tempObj.sessionID = req.sessionID;
    tempObj.nick = req.body.nick;
    tempObj.gameType = req.body.gameType;
    console.log(tempObj);
    usersDb.insert(tempObj, function (err, newTemp) {
        console.log("Dodano dokument (obiekt): " + newTemp);
    })
    usersDb.findOne({ sessionID: req.sessionID }, function (err, sessionCheck) {
        if (sessionCheck.gameType == "Kasjer") {
            res.status(200).sendFile(path.join(__dirname + "/static/cashier.html"));
        }
        else if (sessionCheck.gameType == "Piekarz") {
            res.status(200).sendFile(path.join(__dirname + "/static/baker.html"))
        }
        else {
            res.status(400).send("Coś poszło nie tak...");
        }
    })
})

app.listen(PORT, function () {
    console.log("Serwer działa na porcie " + PORT)
})