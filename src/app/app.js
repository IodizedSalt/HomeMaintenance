const express = require('express')
const app = express()
const path = require("path") 
const port = 8000
const routes = require("./routes")
const fs = require("fs")
const cors = require('cors');

app.use(express.json());
app.use(cors({
    // origin: ['http://localhost:3000','http://localhost:8000', 'http://192.168.1.160:49160'] // Replace with your allowed origin
    origin: 'http://192.168.1.160:49160',
    // Replace with your allowed origin
    // methods: ['GET', 'POST'], // Specify the HTTP methods you want to allow
  }));
app.use(express.static(path.join(__dirname, '../.', '')));
app.set("view_engine", "ejs")
app.set("views", path.join(__dirname,  '../.')); // Set the directory where your EJS templates are stored

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
app.post('/count', (req, res) => {
        console.log(req.body)
        const options = {}
        fs.readdir(__dirname + '/img/piesku/', (err, files) => {
        var jpg_count = files.filter(ext => ext.split('.').splice(-1) == 'jpg')
        //   console.log(jpg_count.length)
        options['file_count'] = jpg_count.length
        var count = jpg_count.length
        fs.writeFile(__dirname + '/data.json', JSON.stringify(options), (err) => {
            if (err) throw err;
            })
            res.json(options)
        })
});

// Get JSON of home maintenance tasks post
app.post('/list-tasks', (req, res) => {
    // test123
    console.log(req.body)
    // send some response
    fs.readFile(__dirname + '/home_maintenance_tasks.json', (err, tasks) => {
        console.log(JSON.parse(tasks))
        const tasks_list = JSON.parse(tasks)
        var options = {'asdf': 'asdf'}
        res.json(tasks_list)
        })
});


// Get JSON of home maintenance tasks post
app.post('/list-tasks-status', (req, res) => {
    // test123
    console.log(req.body)
    // send some response
    fs.readFile(__dirname + '/home_maintenance_tasks_status.json', (err, tasks) => {
        console.log(JSON.parse(tasks))
        const tasks_list_status = JSON.parse(tasks)
        res.json(tasks_list_status)
        })
});

// Get txt of notepad post
app.post('/get-notepad', (req, res) => {
    // test123
    console.log(req.body)
    // send some response
    fs.readFile(__dirname + '/notepad.txt', (err, text) => {
        res.send(text)
        })
});
// Get txt of notepad post
app.post('/save-notepad', (req, res) => {
    // test123
    console.log(req.body)
    // send some response
    fs.writeFile(__dirname + '/notepad.txt', req.body['notepad_text'], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error writing to the file.");
        }

        console.log("File has been written successfully.");
        res.send({response_text: "File has been written successfully.", notepad_text: req.body['notepad_text']});
    });
});

const command =  process.env.SCRIPT_TYPE

app.use("/routes", routes)
app.listen(port, function(){
    if(command == 'start'){
        console.log("IF YOU ARE DEVELOPING LOCALLY, YOU'VE RUN THE WRONG COMMAND (npm run start_local_dev) :)\n" + `Example app listening on port ${port}!`)
    }else if(command == 'start_local_dev'){
        console.log(`Example app listening on port ${port}!`)
    }else{
        console.log("Please use one of the npm commands (start, start_local_dev) \n" + `Example app listening on port ${port}!`)
    }
})
//console.log(`Example app listening on port ${port}!`))


// Example post
// app.post('/some-api-endpoint', (req, res) => {
//     // test123
//     console.log(req.body)
//     // send some response
//     var options = {'asdf': 'asdf'}
//     res.json(options)
// });