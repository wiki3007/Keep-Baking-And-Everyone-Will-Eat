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
let randomColor1, randomColor2, randomColor3, randomTower, cashierUpdate, cashierSend, newColor1, newColor2, newColor3, newTowerLevel, orderText;
var doc = {
    a: "a",
    b: "b"
};
coll1.findOne({ _id: 'colourssS' }, function (err, doc) {
    console.log("----- obiekt pobrany z bazy: ", doc)
    console.log("----- formatowanie obiektu JS na format JSON: ")
    console.log(JSON.stringify(doc, null, 5))
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/static", express.static('./static/'))

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
    coll1.insert(tempObj, function (err, newTemp) {
        console.log("Dodano dokument (obiekt): " + newTemp);
    })
    coll1.findOne({ sessionID: req.sessionID }, function (err, sessionCheck) {
        if (sessionCheck.gameType == "Kasjer") {
            console.log(__dirname);
            res.status(200).sendFile(path.join(__dirname + "/static/cashier/cashier.html"));
        }
        else if (sessionCheck.gameType == "Piekarz") {
            console.log(__dirname);
            res.status(200).sendFile(path.join(__dirname + "/static/baker/baker.html"))
        }
        else {
            res.status(400).send("Coś poszło nie tak...");
        }
    })
})
app.get("/getOrder", function (req, res) {
    coll1.findOne({ _id: "colourssS" }, function (err, newOrder) {
        //console.log(newCashier.color3);
        randomColor1 = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
        newColor1 = newOrder[randomColor1]
        randomColor2 = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
        newColor2 = newOrder[randomColor2]
        randomColor3 = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
        newColor3 = newOrder[randomColor3]
    })
    coll1.findOne({ _id: "caketower" }, function (err, newTower) {
        randomTower = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
        console.log(newTower[randomTower]);
        newTowerLevel = newTower[randomTower];
    })
    coll1.findOne({ _id: "cashier" }, function (err, newCashier) {
        //console.log(newCashier["color1"]);
        newCashier.color1 = newColor1
        newCashier.color2 = newColor2
        newCashier.color3 = newColor3
        newCashier.towerLevel = newTowerLevel
        console.log(newColor1, newColor2, newColor3, newTowerLevel);
        console.log(newCashier);
        orderText = randomColor1 + " x jeden kolor \n" + randomColor2 + " x drugi kolor \n" + randomColor3 + " x trzeci kolor \nLiczba pięter: " + randomTower;
        console.log(orderText);
        cashierUpdate = newCashier
        console.log(cashierUpdate);
        coll1.update({ _id: "cashier" }, { $set: cashierUpdate }, {}, function (err, updatedCashier) {
            console.log("zaktualizowano " + err)
        })
        coll1.findOne({ _id: "cashier" }, {}, function (err, newCashier2) {
            console.log(newCashier2);
        })
        res.end(orderText);
    })


})
app.post("/checkCake", function (req, res) {
    console.log(req.body);
    coll1.update({ _id: "baker" }, { $set: req.body }, {}, function (err, updatedBaker) {
        console.log("Zaaktualizowano: " + updatedBaker);
    })
    coll1.findOne({_id: "baker"}, {}, function (err, doc2) {
        piekarzjson= JSON.stringify(doc2, null, 5)

        
    })
    coll1.findOne({ _id: "cashier" }, {}, function (err, doc) {
          kasjerjson = JSON.stringify(doc, null, 5)

    })
    console.log(kasjerjson)
    console.log(piekarzjson)
     res.status(200).sendFile(path.join(__dirname + "/static/wannasee.html"))
})

app.get("/gameresults", function (req, res) {
    if(kasjerjson == piekarzjson){
    res.send("Wygrana!");
    }
    else{
        res.send("przegrana :(");
    }
})

app.listen(PORT, function () {
    console.log("Serwer działa na porcie " + PORT)
})
