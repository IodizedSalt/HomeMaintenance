// Example Post
// function examplePost() {
//     fetch("http://localhost:8000/some-api-endpoint", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             'Access-Control-Allow-Origin': '*'
//         },
//         mode: 'cors',
//         body: JSON.stringify({
//             test: "test123"
//         })
//     }).then((response) => {
//         if (response.ok) {
//             response.json().then(jsonresponse => {
//                 // 'asdf'
//                 console.log(jsonresponse);
//             });
//         }
//     });
// }

const ENV_TYPE = document.currentScript.getAttribute('env_type');

if (ENV_TYPE == 'LOCAL') {
    var API_PREFIX = 'http://localhost:8000';
    var URL_PREFIX = 'http://localhost:8000/routes';
} else if (ENV_TYPE == 'DEV') {
    var API_PREFIX = 'http://192.168.1.160:49160';
    var URL_PREFIX = 'http://192.168.1.160:49160/routes';
}
console.log(URL_PREFIX)

// Initial start date that will be forever used to calculate when tasks need to be accomplished
// ヽ༼ຈل͜ຈ༽ﾉ All hail ISO 8601 ヽ༼ຈل͜ຈ༽ﾉ
var start_date = new Date("2023-08-11T00:00:00.000Z")
var start_date_week_number = getISOWeekNumber(start_date);
console.log(start_date_week_number)

var current_date = new Date()
// var current_week_number = getISOWeekNumber(new Date())
var current_week_number = 1
console.log(current_week_number)


function getISOWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  }

function forceCycle(image_type, increment_amnt) {
    var images = [];
    const img_count = JSON.parse(sessionStorage.getItem("img_count"));
    
    if (image_type == 'stefan') {
        var file_path_array = document.getElementById('current_img').src.toString().split('/');
        var file_name = document.getElementById('current_img').src.toString().split('/').slice(-1)[0];
        file_name = file_name.split('.')[0];
        var updated_file = parseInt(file_name) + parseInt(increment_amnt);
        
        if (parseInt(updated_file) > img_count) {
            updated_file = 1;
        } else if (parseInt(updated_file) <= 0) {
            updated_file = img_count;
        }
        
        updated_file = updated_file.toString() + '.jpg';
        file_path_array.pop();
        file_path_array.push(updated_file.toString());
        var new_file = file_path_array.join('/');
        document.getElementById('current_img').src = new_file;
    }
}

function beginCycle(image_type) {
    const data = { test: "123" };
}

function getImgCount() {
    fetch(API_PREFIX + "/count", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors',
        body: JSON.stringify({
            test: "test"
        })
    }).then((response) => {
        if (response.ok) {
            response.json().then(img_count_res => {
                sessionStorage.setItem("img_count", parseInt(img_count_res['file_count']));
            });
        }
    });
}

function getTasks() {
    fetch(API_PREFIX + "/list-tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors',
        body: JSON.stringify({
            current_week_number: current_week_number
        })
    }).then((response) => {
        if (response.ok) {
            response.json().then(tasks_list => {
                console.log(tasks_list)
                sessionStorage.setItem("tasks_list", JSON.stringify(tasks_list));
                const weekDifference = getCurrentWeekDifference(start_date, current_date)
                getTasksWeekly();
                getTasksBiWeekly(weekDifference);
                getTasksMonthly(weekDifference);
                getTasksBiMonthly(weekDifference);
                getTasksQuarterly(weekDifference);
                getTasksBiannually(weekDifference);
                getTasksYearly(weekDifference);
                getTasksBiennialy(weekDifference);
            });
        }
    });
}

function getTasksPeriodicity(periodicity) {
    return JSON.parse(sessionStorage.getItem("tasks_list"))[periodicity];
}

function getTasksWeekly() {
    var tasks = getTasksPeriodicity('weekly');
    appendTaskToDom('weekly', tasks);
}

function getTasksBiWeekly(weekDifference) {
    var tasks = getTasksPeriodicity('biweekly');
    // console.log(weekDifference)
    // if (weekDifference >= 2) {
        appendTaskToDom('biweekly', tasks);
    // }
}

function getTasksMonthly(weekDifference) {
    var tasks = getTasksPeriodicity('monthly');
    // if (weekDifference >= 4) {
        appendTaskToDom('monthly', tasks);
    // }
}

function getTasksBiMonthly(weekDifference) {
    var tasks = getTasksPeriodicity('bimonthly');
    // console.log(weekDifference)
    // if (weekDifference >= 8) {
        appendTaskToDom('bimonthly', tasks);
    // }
}

function getTasksQuarterly(weekDifference) {
    var tasks = getTasksPeriodicity('quarterly');
    
    // if (weekDifference >= 13) {
        appendTaskToDom('quarterly', tasks);
    // }
}

function getTasksBiannually(weekDifference) {
    var tasks = getTasksPeriodicity('biannually');
    
    // if (weekDifference >= 26) {
        appendTaskToDom('biannually', tasks);
    // }
}

function getTasksYearly(weekDifference) {
    var tasks = getTasksPeriodicity('yearly');
    
    // if (weekDifference >= 52) {
        // if (new Date(current_date).getFullYear() - new Date(start_date).getFullYear() > 0) {
            appendTaskToDom('yearly', tasks);
        // }
    // }
}

function getTasksBiennialy(weekDifference) {
    var tasks = getTasksPeriodicity('biennially');
    
    // if ((current_week_number - start_date_week_number) % 52 === 0) {
    //     if ((new Date(current_date).getFullYear() - new Date(start_date).getFullYear()) % 2 === 0) {
            appendTaskToDom('biennially', tasks);
        // }
    // }
}

function getCurrentWeekDifference(){
    // Calculate the difference in milliseconds between the two dates
    const timeDifference = current_date - start_date;
    
    // Calculate the difference in weeks
    const weekDifference = Math.floor(timeDifference / (7 * 24 * 60 * 60 * 1000));
    
    return weekDifference;
}

function completeTask(task_id, periodicity) {
    var user_name = prompt("Who are you?");
    if (user_name == null) {
        return; // Cancel click
    } else if (user_name.toUpperCase() == 'COM' || user_name.toUpperCase() == '4414') { // Mis wants numbers instead
        fetch(API_PREFIX + "/complete-task", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            mode: 'cors',
            body: JSON.stringify({
                "current_week_number": current_week_number, 
                "task_id": task_id, 
                "periodicity": periodicity,
                "completed_by": user_name,
                "completed_time": new Date(),
                "device_info": window.navigator.userAgent
            })
        }).then((response) => {
            if (response.ok) {
                response.text().then(complete_task_status => {
                    complete_task_status = JSON.parse(complete_task_status)
                    if(complete_task_status.status == 0){
                        if(parseInt(complete_task_status.task_id) == parseInt(task_id) && complete_task_status.periodicity == periodicity){
                            const selector = `[task_id="${complete_task_status.task_id}"][task_periodicity="${complete_task_status.periodicity}"]`;
                            document.querySelector(selector).parentNode.remove();
                            if(document.getElementsByClassName("task_element").length == 0){
                                var img_relax = document.createElement("img")
                                img_relax.src = '/app/img/misc/beer.png'
                                document.getElementById("current_tasks").appendChild(document.createElement("br"))
                                document.getElementById("current_tasks").appendChild(img_relax);
                            }
                        }
                    }
                });
            }
        });

    } else {
        location.href = URL_PREFIX + '/error';
    }
}

function godMode(){
    const elementsToRemove = document.querySelectorAll('.task_element');

    elementsToRemove.forEach(element => {
        element.remove();
        if(document.getElementsByClassName("task_element").length == 0){
            var img_relax = document.createElement("img")
            img_relax.src = '/app/img/misc/beer.png'
            document.getElementById("current_tasks").appendChild(document.createElement("br"))
            document.getElementById("current_tasks").appendChild(img_relax);
        }
    });
}

function appendTaskToDom(periodicity, task_list) {
    if(task_list.length == 0){
        var img_relax = document.createElement("img")
        img_relax.src = '/app/img/misc/beer.png'
        document.getElementById("current_tasks").appendChild(document.createElement("br"))
        document.getElementById("current_tasks").appendChild(img_relax);
    }else{
        Object.entries(task_list['tasks']).forEach(task => {
            const [task_id, task_text] = task;
            const node = document.createElement("div");
            node.className = 'task_element';
            const button = document.createElement("button");
            button.innerHTML = task_text;
            button.setAttribute('task_id', task_id);
            console.log(periodicity, task_text)
            button.setAttribute('task_periodicity', periodicity);
            
            button.className = "btn btn-primary" + " " + periodicity;
            button.onclick = function () {
                completeTask(task_id, periodicity);
            };
            node.appendChild(button);
            node.appendChild(document.createElement("br"));
            node.appendChild(document.createElement("br"));
            document.getElementById("current_tasks").appendChild(node);
        });
        }
    }
    
function appendFutureTaskToDom(task_list) {
    Object.entries(task_list).forEach(task => {
        const [task_id, task_text] = task;
        const node = document.createElement("div");
        const textnode = document.createTextNode(task_text);
        node.appendChild(textnode);
        document.getElementById("upcoming_tasks").appendChild(node);
    });
}

function getText() {
    fetch(API_PREFIX + "/get-notepad", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors',
        body: JSON.stringify({
            test: "test"
        })
    }).then((response) => {
        if (response.ok) {
            response.text().then(notepad_text => {
                document.getElementById("notepad_text").value = notepad_text;
                sessionStorage.setItem("notepad_text", notepad_text);
            });
        }
    });
}

var saveInProgress = false;

function saveText() {
    if (!saveInProgress) {
        var notepad_text_payload = document.getElementById("notepad_text").value;
        saveInProgress = true;
        fetch(API_PREFIX + "/save-notepad", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            mode: 'cors',
            body: JSON.stringify({
                notepad_text: notepad_text_payload
            })
        }).then((response) => {
            if (response.ok) {
                document.getElementById("save_success_message").style.display = 'block';
                setTimeout(function () {
                    document.getElementById("save_success_message").style.display = 'none';
                }, 3000);
                response.json().then(response => {
                    document.getElementById("notepad_text").value = response['notepad_text'];
                    saveInProgress = false;
                });
            } else if (!response.ok) {
                saveInProgress = false;
                document.getElementById("save_error_message").style.display = 'block';
                setTimeout(function () {
                    document.getElementById("save_error_message").style.display = 'none';
                }, 3000);
            }
        }).catch(error => {
            saveInProgress = false;
            document.getElementById("save_error_message").style.display = 'block';
            setTimeout(function () {
                document.getElementById("save_error_message").style.display = 'none';
            }, 3000);
        });
    }
}
