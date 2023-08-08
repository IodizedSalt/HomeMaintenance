const express = require("express");
const router = express.Router();
const app = express()
const path = require("path") 
const fs = require("fs")


// app.use(express.static(path.join(__dirname, '/.', '')));
// app.use(express.static(path.join(__dirname, 'js')));
// app.use(express.static(path.join(__dirname, 'css')));

// Home page route.
router.get("/piesku", function (req, res) {
    res.sendFile(__dirname + '/html/piesku.html');
});


// Home page route.
router.get("/homemaintenance", function (req, res) {
    res.sendFile(__dirname + '/html/homemaintenance.html');
});

module.exports = router;