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
var doc = {
    a: "a",
    b: "b"
};
coll1.findOne({ _id: 'colourssS' }, function (err, doc) {
    console.log("----- obiekt pobrany z bazy: ",doc)
    console.log("----- formatowanie obiektu js na format JSON: ")
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

app.post("/game", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/game.html"));
})

app.listen(PORT, function () {
    console.log("Serwer działa na porcie " + PORT)
})