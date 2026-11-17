const express = require("express");
const router = express.Router();
const app = express()
const path = require("path") 
const fs = require("fs")


// app.use(express.static(path.join(__dirname, '/.', '')));
// app.use(express.static(path.join(__dirname, 'js')));
// app.use(express.static(path.join(__dirname, 'css')));
const command =  process.env.SCRIPT_TYPE
var env_type = ""
if(command == 'start'){
    env_type = 'DEV'
}else if(command == 'start_local_dev'){
    env_type = 'LOCAL'
}else{
    env_type = 'LOCAL'
}

const { createProxyMiddleware } = require('http-proxy-middleware');

// Dog
router.get("/piesku", function (req, res) {
    res.render(__dirname + '/html/piesku.ejs', {env_type});
});



router.get("/dinner", function (req, res) {
    const dictionaryPath = path.join(
        __dirname,
        "data/dinner/utils/ingredients_dictionary.json"
    );

    const dictionary = JSON.parse(
        fs.readFileSync(dictionaryPath, "utf8")
    );

    res.render(
        path.join(__dirname, "html/recipes.ejs"),
        {
            env_type: env_type,
            ingredients: dictionary.ingredients.slice(0, 30),
            recipes: dictionary.recipes
        }
    );
});
// notepad
router.get("/notepad", function (req, res) {
    res.render(__dirname + '/html/notepad.ejs', {env_type});
});


// house maintenance tasks.
router.get("/homemaintenance", function (req, res) {
    res.render(__dirname + '/html/homemaintenance.ejs', {env_type});
});

// Storskrald
router.get("/storskrald", function (req, res) {
    res.render(__dirname + '/html/storskrald.ejs', {env_type});
});


// error route.
router.get("/error", function (req, res) {
    res.sendFile(__dirname + '/img/blocked/PageBlocked.png');
});

module.exports = router;