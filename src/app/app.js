const express = require('express');
const app = express();
const path = require("path");
const port = 8000;
const routes = require("./routes");
const fs = require("fs");
const cors = require('cors');

app.use(express.json());

app.use(cors({
  origin: '*',
}));
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
app.configure(function() {
    app.use(allowCrossDomain);
    //some other code
});   
app.use(express.static(path.join(__dirname, '../.', '')));
app.set("view_engine", "ejs");
app.set("views", path.join(__dirname, '../.'));

app.options('*', cors());

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.post('/count', (req, res) => {
  console.log(req.body);
  const options = {};
  fs.readdir(__dirname + '/img/piesku/', (err, files) => {
    var jpg_count = files.filter(ext => ext.split('.').splice(-1) == 'jpg');
    options['file_count'] = jpg_count.length;
    var count = jpg_count.length;
    fs.writeFile(__dirname + '/data.json', JSON.stringify(options), (err) => {
      if (err) throw err;
    });
    res.json(options);
  });
});

app.post('/list-tasks', (req, res) => {
  console.log(req.body);
  fs.readFile(__dirname + '/home_maintenance_tasks.json', (err, tasks) => {
    console.log(JSON.parse(tasks));
    const tasks_list = JSON.parse(tasks);
    var options = {'asdf': 'asdf'};
    res.json(tasks_list);
  });
});

app.post('/list-tasks-status', (req, res) => {
  console.log(req.body);
  fs.readFile(__dirname + '/home_maintenance_tasks_status.json', (err, tasks) => {
    console.log(JSON.parse(tasks));
    const tasks_list_status = JSON.parse(tasks);
    res.json(tasks_list_status);
  });
});

app.post('/get-notepad', (req, res) => {
  console.log(req.body);
  fs.readFile(__dirname + '/notepad.txt', (err, text) => {
    res.send(text);
  });
});

app.post('/save-notepad', (req, res) => {
  console.log(req.body);
  fs.writeFile(__dirname + '/notepad.txt', req.body['notepad_text'], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error writing to the file.");
    }
    console.log("File has been written successfully.");
    res.send({ response_text: "File has been written successfully.", notepad_text: req.body['notepad_text'] });
  });
});

const command = process.env.SCRIPT_TYPE;

app.use("/routes", routes);

app.listen(port, function(){
  if (command == 'start') {
    console.log("IF YOU ARE DEVELOPING LOCALLY, YOU'VE RUN THE WRONG COMMAND (npm run start_local_dev) :)\n" + `Example app listening on port ${port}!`);
  } else if (command == 'start_local_dev') {
    console.log(`Example app listening on port ${port}!`);
  } else {
    console.log("Please use one of the npm commands (start, start_local_dev) \n" + `Example app listening on port ${port}!`);
  }
});
