const express = require('express')
const path = require("path") 
const app = express()

app.get("/stefan", function(req,res) {
    res.sendFile(__dirname + "./html/piesku.html");
});