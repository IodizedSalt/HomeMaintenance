const express = require('express')
const app = express()
const path = require("path") 
const port = 8000
const routes = require("./routes")
const fs = require("fs")


// app.use(express.static(path.join(__dirname, '/.', '')));
// app.use(express.static(path.join(__dirname, 'app')));
// app.use(express.static(path.join(__dirname, './css')));

app.get('/', function(req, res){

    res.sendFile(__dirname + '/index.html');
});

app.use("/routes", routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


