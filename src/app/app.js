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

  const currentWeekNumber = req.body.current_week_number
  const taskData = JSON.parse(fs.readFileSync(__dirname + '/data/home_maintenance_tasks.json', 'utf8'));

  // Read and parse status.json
  const statusData = JSON.parse(fs.readFileSync(__dirname + '/data/home_maintenance_tasks_status.json', 'utf8'));
  // Define the valid periodicities
  const validPeriodicities = ['weekly', 'biweekly', 'monthly', 'bimonthly', 'quarterly', 'biannually', 'yearly', 'biennially'];

    // Filter tasks in task.json based on the presence in status.json and future appearances
    const filteredTasks = Object.keys(taskData.periodicity).reduce((result, periodicity) => {
      if (validPeriodicities.includes(periodicity)) {
          // Filter tasks for the current periodicity
          result[periodicity] = {
              tasks: {}
          };

          Object.keys(taskData.periodicity[periodicity].tasks).forEach(taskId => {
              const task = taskData.periodicity[periodicity].tasks[taskId];

              // Check if there is a matching status entry in status.json for the current week
              const matchingStatus = statusData.completed_tasks[currentWeekNumber] && statusData.completed_tasks[currentWeekNumber].find(status =>
                  status.task_id === taskId && status.periodicity === periodicity
              );

              if (!matchingStatus) {
                  // Check if the task should appear in the future based on its periodicity
                  if (shouldTaskAppearInFuture(taskId, periodicity, currentWeekNumber)) {
                      result[periodicity].tasks[taskId] = task;
                  }
              }
          });
      }

      return result;
  }, {});

// Function to determine if a task should appear in the future
function shouldTaskAppearInFuture(taskId, periodicity, currentWeekNumber) {
  // Define the periodicity timepoints (in weeks)
  const timepoints = {
      weekly: 1,
      biweekly: 2,
      monthly: 4,
      bimonthly: 8,
      quarterly: 13, // Assuming a quarter is approximately 13 weeks
      biannually: 26, // Assuming half a year is approximately 26 weeks
      yearly: 52, // Assuming a year is approximately 52 weeks
      biennially: 104 // Assuming two years are approximately 104 weeks
  };

  // Get the timepoint for the current periodicity
  const timepoint = timepoints[periodicity];

  // Calculate the range of week numbers for the given periodicity
  const weekNumbers = Array.from({ length: timepoint }, (_, i) => currentWeekNumber - i);

  // Check if there is a matching status entry in status.json for any week in the range
  const matchingStatus = weekNumbers.some((weekNumber) =>
      statusData.completed_tasks[weekNumber] &&
      statusData.completed_tasks[weekNumber].find(
          (status) => status.task_id === taskId && status.periodicity === periodicity
      )
  );

  return !matchingStatus;
}

  // Send the filteredTasks as a JSON response
  res.json(filteredTasks);
});

app.post('/list-tasks-status', (req, res) => {
  fs.readFile(__dirname + '/data/home_maintenance_tasks_status.json', (err, tasks) => {
    console.log(JSON.parse(tasks));
    const tasks_list_status = JSON.parse(tasks);
    res.json(tasks_list_status);
  });
});


app.post('/complete-task', (req, res) => {
  var current_week_number = req.body.current_week_number
  var task_id = req.body.task_id
  var periodicity = req.body.periodicity
  var completed_by = req.body.completed_by
  var completed_time = req.body.completed_time
  var device_info = req.body.device_info
  
  fs.readFile(__dirname + '/data/home_maintenance_tasks.json', (err, tasks) => {
    var tasks_list = JSON.parse(tasks);
    var task_to_add =  {
      'task_id': task_id, 
      'task_name': tasks_list.periodicity[periodicity]['tasks'][task_id],
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
  
          if (completedTasks.hasOwnProperty(current_week_number)) {
              completedTasks[current_week_number].push(task_to_add);
          } else {
              completedTasks[current_week_number] = [task_to_add];
          }
  
          // Write the updated JSON back to the file.
          fs.writeFile(__dirname + '/data/home_maintenance_tasks_status.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
              if (err) {
                  console.error('Error writing file:', err);
              } else {
                  console.log(`Successfully updated week ${current_week_number}.`);
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
