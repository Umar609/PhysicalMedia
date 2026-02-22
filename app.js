const express = require("express");
const path = require("path");

const print = console.log;
const VIEWS_PATH = path.join(__dirname, "/views/"); 

const PORT_NUMBER = 8080;

let app = express();

app.use(express.static("node_modules/bootstrap/dist/css"));
app.use(express.static("images"));
app.listen(PORT_NUMBER, function () {
    print(`listening on port ${PORT_NUMBER}`);
});

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  fileName = VIEWS_PATH + "index.html";
  res.sendFile(fileName);
});

app.use((request, response) => {
    response.render("404");
});

// Works for all HTTP methods and avoids issues with the new route parser
app.use((request, response) => {
    response.status(404).render("404");
});

