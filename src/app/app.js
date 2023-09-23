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
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

app.use(express.static(path.join(__dirname, '../.', '')));
app.set("view_engine", "ejs");
app.set("views", path.join(__dirname, '../.'));

app.options('*', cors());

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.post('/count', (req, res) => {
  // console.log(req.body);
  const options = {};
  fs.readdir(__dirname + '/img/piesku/', (err, files) => {
    var jpg_count = files.filter(ext => ext.split('.').splice(-1) == 'jpg');
    options['file_count'] = jpg_count.length;
    var count = jpg_count.length;
    fs.writeFile(__dirname + '/data/misc_data.json', JSON.stringify(options), (err) => {
      if (err) throw err;
    });
    res.json(options);
  });
});

app.post('/list-tasks', (req, res) => {
  const current_week_number = req.body.current_week_number
  const task_data = JSON.parse(fs.readFileSync(__dirname + '/data/home_maintenance_tasks.json', 'utf8'));

  // Read and parse status.json
  const status_data = JSON.parse(fs.readFileSync(__dirname + '/data/home_maintenance_tasks_status.json', 'utf8'));

  const all_periodicities = task_data.periodicity || {}; // Get all periodicities or an empty object if none exist
  const result = {}; // To store the filtered tasks for all periodicities

  for (const periodicity in all_periodicities) {
    if (all_periodicities.hasOwnProperty(periodicity)) {
      const periodicity_tasks = all_periodicities[periodicity].tasks;
      result[periodicity] = {};

      // Filter tasks in task.json based on the presence in status.json
      for (const task_id in periodicity_tasks) {
        if (periodicity_tasks.hasOwnProperty(task_id)) {
          const task = periodicity_tasks[task_id];
          const matching_status = status_data.completed_tasks[current_week_number] && status_data.completed_tasks[current_week_number].find(task => parseInt(task.task_id) === parseInt(task_id));
          
          if (!matching_status) {
            result[periodicity][task_id] = task;
          }
        }
      }
    }
  }

  res.json(result);
});

app.post('/list-tasks-status', (req, res) => {
  fs.readFile(__dirname + '/data/home_maintenance_tasks_status.json', (err, tasks) => {
    console.log(JSON.parse(tasks));
    const tasks_list_status = JSON.parse(tasks);
    res.json(tasks_list_status);
  });
});


app.post('/complete-task', (req, res) => {
  var week_number = req.body.week_number
  var task_id = req.body.task_id
  var periodicity = req.body.periodicity
  var completed_by = req.body.completed_by
  var completed_time = req.body.completed_time
  var device_info = req.body.device_info
  
  fs.readFile(__dirname + '/data/home_maintenance_tasks.json', (err, tasks) => {
    var tasks_list = JSON.parse(tasks);
    var task_to_add =  {
      'task_id': task_id, 
      'task_name': tasks_list.periodicity.task_id,
      'periodicity': periodicity,
      'completed_by': completed_by,
      'completed_time': completed_time,
      'device_info': device_info
    }
    fs.readFile(__dirname + '/data/home_maintenance_tasks_status.json', 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading file:', err);
          return;
      }
  
      try {
          const jsonData = JSON.parse(data);
          const completedTasks = jsonData.completed_tasks;
  
          if (completedTasks.hasOwnProperty(week_number)) {
              completedTasks[week_number].push(task_to_add);
          } else {
              completedTasks[week_number] = [task_to_add];
          }
  
          // Write the updated JSON back to the file.
          fs.writeFile(__dirname + '/data/home_maintenance_tasks_status.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
              if (err) {
                  console.error('Error writing file:', err);
              } else {
                  console.log(`Successfully updated week ${week_number}.`);
                  res.json({status: 0, task_id: task_id, periodicity: periodicity})
              }
          });
      } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
      }
  });
  });

});

app.post('/get-notepad', (req, res) => {
  console.log(req.body);
  fs.readFile(__dirname + '/data/notepad.txt', (err, text) => {
    res.send(text);
  });
});

app.post('/save-notepad', (req, res) => {
  console.log(req.body);
  fs.writeFile(__dirname + '/data/notepad.txt', req.body['notepad_text'], (err) => {
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
