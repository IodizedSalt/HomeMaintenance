// Example Post
function examplePost() {
    fetch("http://localhost:8000/some-api-endpoint", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': 'http://192.168.1.160'
        },
        mode: 'cors',
        body: JSON.stringify({
            test: "test123"
        })
    }).then((response) => {
        if (response.ok) {
            response.json().then(jsonresponse => {
                // 'asdf'
                console.log(jsonresponse);
            });
        }
    });
}

const ENV_TYPE = document.currentScript.getAttribute('env_type');

if (ENV_TYPE == 'LOCAL') {
    var API_PREFIX = 'http://localhost:8000';
    var URL_PREFIX = 'http://localhost:8000/routes';
} else if (ENV_TYPE == 'DEV') {
    var API_PREFIX = 'http://192.168.1.160';
    var URL_PREFIX = 'http://192.168.1.160/routes';
}

const start_date = new Date("2023-08-11T00:00:00.000Z").toISOString();
startDate = new Date((new Date(start_date)).getFullYear(), 0, 1);
var days = Math.floor((new Date(start_date) - startDate) /
    (24 * 60 * 60 * 1000));
const start_date_week_number = Math.ceil(days / 7);

const current_date = new Date().toISOString();

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
        console.log(new_file);
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
            'Access-Control-Allow-Origin': 'http://192.168.1.160'
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
            'Access-Control-Allow-Origin': 'http://192.168.1.160'
        },
        mode: 'cors',
        body: JSON.stringify({
            test: "test"
        })
    }).then((response) => {
        if (response.ok) {
            response.json().then(tasks_list => {
                sessionStorage.setItem("tasks_list", JSON.stringify(tasks_list));
                fetch(API_PREFIX + "/list-tasks-status", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Access-Control-Allow-Origin': 'http://192.168.1.160'
                    },
                    mode: 'cors',
                    body: JSON.stringify({
                        test: "test"
                    })
                }).then((response) => {
                    if (response.ok) {
                        response.json().then(tasks_list => {
                            sessionStorage.setItem("tasks_list_status", JSON.stringify(tasks_list));
                            var currentDate = new Date();
                            var startDate = new Date(currentDate.getFullYear(), 0, 1);
                            var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
                            const week_number = Math.ceil(days / 7);
                            getTasksWeekly(week_number);
                            getTasksBiWeekly(week_number);
                            getTasksMonthly(week_number);
                            getTasksBiMonthly(week_number);
                            getTasksQuarterly(week_number);
                            getTasksBiannually(week_number);
                            getTasksYearly(week_number);
                            getTasksBiennialy(week_number);
                        });
                    }
                });
            });
        }
    });
}

function getTasksPeriodicity(periodicity) {
    return JSON.parse(sessionStorage.getItem("tasks_list"))['periodicity'][periodicity]['tasks'];
}

function getTasksWeekly(current_week_number) {
    var tasks = getTasksPeriodicity('weekly');
    appendTaskToDom('weekly', tasks);
}

function getTasksBiWeekly(current_week_number) {
    var tasks = getTasksPeriodicity('biweekly');
    
    if ((current_week_number - start_date_week_number) % 2 === 0) {
        appendTaskToDom('biweekly', tasks);
    }
}

function getTasksMonthly(current_week_number) {
    var tasks = getTasksPeriodicity('monthly');
    
    if ((current_week_number - start_date_week_number) % 4 === 0) {
        appendTaskToDom('monthly', tasks);
    }
}

function getTasksBiMonthly(current_week_number) {
    var tasks = getTasksPeriodicity('bimonthly');
    
    if ((current_week_number - start_date_week_number) % 8 === 0) {
        appendTaskToDom('bimonthly', tasks);
    }
}

function getTasksQuarterly(current_week_number) {
    var tasks = getTasksPeriodicity('quarterly');
    
    if ((current_week_number - start_date_week_number) % 13 === 0) {
        appendTaskToDom('quarterly', tasks);
    }
}

function getTasksBiannually(current_week_number) {
    var tasks = getTasksPeriodicity('biannually');
    
    if ((current_week_number - start_date_week_number) % 26 === 0) {
        appendTaskToDom('biannually', tasks);
    }
}

function getTasksYearly(current_week_number) {
    var tasks = getTasksPeriodicity('yearly');
    
    if ((current_week_number - start_date_week_number) % 52 === 0) {
        if (new Date(current_date).getFullYear() - new Date(start_date).getFullYear() > 0) {
            appendTaskToDom('yearly', tasks);
        }
    }
}

function getTasksBiennialy(current_week_number) {
    var tasks = getTasksPeriodicity('biennially');
    
    if ((current_week_number - start_date_week_number) % 52 === 0) {
        if ((new Date(current_date).getFullYear() - new Date(start_date).getFullYear()) % 2 === 0) {
            appendTaskToDom('biennially', tasks);
        }
    }
}

function completeTask(task_id, periodicity) {
    console.log(task_id, periodicity);
    var user_name = prompt("Who are you?");
    
    if (user_name == null) {
        return; // Cancel click
    } else if (user_name.toUpperCase() == 'COM' || user_name.toUpperCase() == 'ELLE') {
        console.log('success');
        // TODO: register datetime and mark task as completed
    } else {
        location.href = URL_PREFIX + '/error';
    }
}

function appendTaskToDom(periodicity, task_list) {
    Object.entries(task_list).forEach(task => {
        const [task_id, task_text] = task;
        const node = document.createElement("div");
        node.className = 'task_element';
        const button = document.createElement("button");
        button.className = "btn btn-primary";
        button.innerHTML = task_text;
        button.setAttribute('task_id', task_id);
        button.setAttribute('task_periodicity', periodicity);
        button.onclick = function () {
            completeTask(task_id, periodicity);
        };
        node.appendChild(button);
        document.getElementById("current_tasks").appendChild(node);
        document.getElementById("current_tasks").appendChild(document.createElement("br"));
    });
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
            'Access-Control-Allow-Origin': 'http://192.168.1.160'
        },
        mode: 'cors',
        body: JSON.stringify({
            test: "test"
        })
    }).then((response) => {
        if (response.ok) {
            response.text().then(notepad_text => {
                console.log(notepad_text);
                document.getElementById("notepad_text").value = notepad_text;
                sessionStorage.setItem("notepad_text", notepad_text);
            });
        }
    });
}

var saveInProgress = false;

function saveText() {
    console.log(saveInProgress);
    if (!saveInProgress) {
        var notepad_text_payload = document.getElementById("notepad_text").value;
        saveInProgress = true;
        fetch(API_PREFIX + "/save-notepad", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': 'http://192.168.1.160'
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
                    console.log(response);
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
