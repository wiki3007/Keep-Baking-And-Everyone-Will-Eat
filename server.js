let express = require("express");
let app = express();
let path = require("path")
let bodyParser = require("body-parser")
let PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index.html"));
})

app.post("/game", function (req, res) {
    res.status(200).send(req.body.nick + ", tu wstawić właściwą grę z obsługą fetcha i NeDB. Test fetcha.");
})

app.listen(PORT, function () {
    console.log("Serwer działa na porcie " + PORT)
})