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
  const current_week_number = req.body.current_week_number;
  const current_year = req.body.current_year;
  const taskData = JSON.parse(fs.readFileSync(__dirname + '/data/home_maintenance_tasks.json', 'utf8'));

  // Read and parse status.json
  const statusData = JSON.parse(fs.readFileSync(__dirname + '/data/home_maintenance_tasks_status.json', 'utf8'));

  const validPeriodicities = ['weekly', 'biweekly', 'monthly', 'bimonthly', 'quarterly', 'biannually', 'yearly', 'biennially'];
  var result = {}

  validPeriodicities.forEach(current_periodicity => {
    result[current_periodicity] = {
      tasks: {}
    };
    Object.entries(taskData.periodicity[current_periodicity]['tasks']).forEach(([task_id, task_name]) => {
      // If a task exists with this number of weeks, we don't want to display it because it is already completed for this periodicity
      // E.g, monthly task completed in week 36 will not display until week 40
      var number_of_weeks_to_lookup = calculateNumberOfWeeksFromPeriodicity(current_periodicity, current_week_number)


      if (!number_of_weeks_to_lookup.factor_year_change) {
        // Check if there is a matching status entry in status.json for the task and periodicity
        var matchingStatus = statusData.completed_tasks[current_year] &&
          Object.keys(statusData.completed_tasks[current_year]).some((completed_week_num) =>
            // console.log(number_of_weeks_to_lookup.adjusted_weeks, completed_week_num)&&
            number_of_weeks_to_lookup.adjusted_weeks.includes(parseInt(completed_week_num)) &&
            statusData.completed_tasks[current_year][completed_week_num].find(
              (status) => status.task_id === task_id && status.periodicity === current_periodicity
            )
          );
        if (!matchingStatus) {
          result[current_periodicity].tasks[task_id] = task_name;
        }
      } else {
        // This gets tricky. We might get an array with duplicate week numbers (Biennial), so we need to use the order of the array to split it into year numbers, and parse through the completed tasks that way.
        const splitArrays = [];
        let currentArray = [];
        var adjusted_weeks = number_of_weeks_to_lookup.adjusted_weeks
        for (let i = 0; i < adjusted_weeks.length; i++) {
          if (adjusted_weeks[i] === 1 && currentArray.length === 0) {
            currentArray.push(1);
          } else if (adjusted_weeks[i] === 52 && currentArray.length > 0) {
            splitArrays.push(currentArray);
            currentArray = [52];
          } else {
            currentArray.push(adjusted_weeks[i]);
          }
        }

        // Add the last subarray
        if (currentArray.length > 0) {
          splitArrays.push(currentArray);
        }

        // object containting year: Timpepoint Week numbers of that year
        var week_array_year_mapping = {}
        splitArrays.forEach((sub_array, i) => {
          week_array_year_mapping[current_year - i] = sub_array
        })

        var matchingStatus = false;

        for (const [year, weeks] of Object.entries(week_array_year_mapping)) {
          var yearMatchingStatus = statusData.completed_tasks[year] &&
            Object.keys(statusData.completed_tasks[year]).some((completed_week_num) =>
              weeks.includes(parseInt(completed_week_num)) &&
              statusData.completed_tasks[year][completed_week_num].find(
                (status) => status.task_id === task_id && status.periodicity === current_periodicity
              )
            );

          if (yearMatchingStatus) {
            matchingStatus = true; // Set matchingStatus to true if any year has a match
            break; // Exit the loop
          }
        }

        if (matchingStatus) {
          result[current_periodicity].tasks = {}; // Set tasks to an empty object if matchingStatus is true or yearMatchingStatus is undefined
        } else {
          result[current_periodicity].tasks[task_id] = task_name; // Set the task if matchingStatus is false for all years
        }

      }
    })

  })

  res.json(result);
});



// Returns an array with week numbers based on timepoint from current week
function calculateNumberOfWeeksFromPeriodicity(periodicity, current_week_number){
  const timepoints = {
    weekly: 1,
    biweekly: 2,
    monthly: 4,
    bimonthly: 8,
    quarterly: 13,
    biannually: 26,
    yearly: 52,
    biennially: 104
  };
  // Get the timepoint for the current periodicity
  const timepoint = timepoints[periodicity];
  var adjust_week_num = []
  var factor_year_change = false
  var week_numbers = Array.from({ length: timepoint }, (_, i) => current_week_number - i);
  week_numbers.forEach(week_num =>{
    week_num = parseInt(week_num)
    // We need to do some maths if the task occurs yearly/biennially, because we later need to look at year number in completed tasks
    if(timepoint >52){
      if(week_num < 1 && week_num > -52){
        adjust_week_num.push(52 + parseInt(week_num))
        factor_year_change = true
      }else if(week_num <= -52 && week_num > -104){
        adjust_week_num.push(104 + parseInt(week_num))
        factor_year_change = true
      }else{
        adjust_week_num.push(parseInt(week_num))
      }
    }else{
      if(week_num < 1){
        adjust_week_num.push(52 + parseInt(week_num))
        factor_year_change = true
      }else{
        adjust_week_num.push(parseInt(week_num))
      }
    }
  })
  return {'adjusted_weeks': adjust_week_num, 'factor_year_change': factor_year_change}

}





// app.post('/list-tasks', (req, res) => {
//   const currentWeekNumber = req.body.current_week_number;
//   const currentYear = req.body.current_year;
//   const taskData = JSON.parse(fs.readFileSync(__dirname + '/data/home_maintenance_tasks.json', 'utf8'));

//   // Read and parse status.json
//   const statusData = JSON.parse(fs.readFileSync(__dirname + '/data/home_maintenance_tasks_status.json', 'utf8'));

//   // Define the valid periodicities
//   const validPeriodicities = ['weekly', 'biweekly', 'monthly', 'bimonthly', 'quarterly', 'biannually', 'yearly', 'biennially'];

//   // Filter tasks in task.json based on the presence in status.json and future appearances
//   const filteredTasks = Object.keys(taskData.periodicity).reduce((result, periodicity) => {
//       if (validPeriodicities.includes(periodicity)) {
//           // Filter tasks for the current periodicity
//           result[periodicity] = {
//               tasks: {}
//           };

//           Object.keys(taskData.periodicity[periodicity].tasks).forEach(taskId => {
//               const task = taskData.periodicity[periodicity].tasks[taskId];

//               // Check if there is a matching status entry in status.json for the task and periodicity
//               const matchingStatus = statusData.completed_tasks[currentYear] &&
//                   Object.keys(statusData.completed_tasks[currentYear]).some((weekNumber) =>
//                       statusData.completed_tasks[currentYear][weekNumber] &&
//                       statusData.completed_tasks[currentYear][weekNumber].find(
//                           (status) => status.task_id === taskId && status.periodicity === periodicity
//                       )
//                   );

//               if (!matchingStatus) {
//                   // Check if the task should appear in the future based on its periodicity and last completion date
//                   if (shouldTaskAppearInFuture(taskId, periodicity, currentYear, statusData.completed_tasks)) {
//                       result[periodicity].tasks[taskId] = task;
//                   }
//               }
//           });
//       }

//       return result;
//   }, {});

//   // Function to determine if a task should appear in the future
//   function shouldTaskAppearInFuture(taskId, periodicity, currentYear, completedTasks) {
//       const lastCompletionYear = Object.keys(completedTasks).reduce((latestYear, year) => {
//           if (parseInt(year) <= currentYear) {
//               return Math.max(latestYear, parseInt(year));
//           }
//           return latestYear;
//       }, 0);

//       if (lastCompletionYear === 0) {
//           // No previous completion found, task should appear
//           return true;
//       }

//       const lastCompletionWeeks = Object.keys(completedTasks[lastCompletionYear]);
//       const weeksSinceLastCompletion = (currentYear - lastCompletionYear) * 52;

//       // Define the periodicity timepoints (in weeks)
//       const timepoints = {
//           weekly: 1,
//           biweekly: 2,
//           monthly: 4,
//           bimonthly: 8,
//           quarterly: 13, // Assuming a quarter is approximately 13 weeks
//           biannually: 26, // Assuming half a year is approximately 26 weeks
//           yearly: 52, // Assuming a year is approximately 52 weeks
//           biennially: 104 // Assuming two years are approximately 104 weeks
//       };

//       // Get the timepoint for the current periodicity
//       const timepoint = timepoints[periodicity];
//       console.log('timepoint', timepoint)
//       console.log(weeksSinceLastCompletion)
//       // Check if enough time has passed for the task to appear again
//       return weeksSinceLastCompletion >= timepoint;
//   }

//   res.json(filteredTasks);
// });


app.post('/list-tasks-status', (req, res) => {
  fs.readFile(__dirname + '/data/home_maintenance_tasks_status.json', (err, tasks) => {
    console.log(JSON.parse(tasks));
    const tasks_list_status = JSON.parse(tasks);
    res.json(tasks_list_status);
  });
});


app.post('/complete-task', (req, res) => {
  var current_week_number = req.body.current_week_number
  var current_year_number = new Date().getFullYear() 
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
          var completedTasks = jsonData.completed_tasks[current_year_number];
          if (completedTasks === undefined){
            // Happy new year
            completedTasks = jsonData.completed_tasks
            completedTasks[current_year_number] = {}
            completedTasks[current_year_number][current_week_number] = [task_to_add];
          }else{
            if (completedTasks.hasOwnProperty(current_week_number)) {
                completedTasks[current_week_number].push(task_to_add);
            } else {
                completedTasks[current_week_number] = [task_to_add];
            }
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
