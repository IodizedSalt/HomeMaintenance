// // Example Post
// function examplePost(){
//     fetch("http://localhost:8000/some-api-endpoint", {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json",
//     }, body: JSON.stringify({
//        test: "test123"
//     })
//     }).then((response)=> {
//         if (response.ok) {
//             response.json().then(jsonresponse => {
//                 // 'asdf'
//               console.log(jsonresponse);
//             });
//         }
//     })
// }

const ENV_TYPE = document.currentScript.getAttribute('env_type')
const URL_PREFIX = ""
if(ENV_TYPE == 'LOCAL'){
    const URL_PREFIX = 'http://localhost:8000'
}else if(ENV_TYPE == 'DEV'){
    const URL_PREFIX = 'http://192.168.1.160'
}

// Initial start date that will be forever used to calculate when tasks need to be accomplished
// ヽ༼ຈل͜ຈ༽ﾉ All hail ISO 8601 ヽ༼ຈل͜ຈ༽ﾉ
const start_date = new Date("2023-08-11T00:00:00.000Z").toISOString()

// Calculating the Week number of the start date. Even though it is a constant variable and we could just hardcode it as `28`, we still do it dynamically because we can. 
startDate = new Date((new Date(start_date)).getFullYear(), 0, 1);
var days = Math.floor((new Date(start_date) - startDate) /
    (24 * 60 * 60 * 1000));
const start_date_week_number = Math.ceil(days / 7);

const current_date = new Date().toISOString()

// Change to next image
function forceCycle(image_type, increment_amnt){
    var images = []
    const img_count = JSON.parse(sessionStorage.getItem("img_count"))
    // console.log(increment_amnt)
    if(image_type == 'stefan'){
        var file_path_array = document.getElementById('current_img').src.toString().split('/')
        var file_name = document.getElementById('current_img').src.toString().split('/').slice(-1)[0]
        file_name = file_name.split('.')[0]
        var updated_file = parseInt(file_name) + parseInt(increment_amnt)
        if(parseInt(updated_file) > img_count){
            updated_file = 1
        }else if(parseInt(updated_file) <= 0){
            updated_file = img_count
        }
        updated_file = updated_file.toString() + '.jpg'
        file_path_array.pop()
        file_path_array.push(updated_file.toString())
        var new_file = file_path_array.join('/')

        console.log(new_file)
        document.getElementById('current_img').src = new_file
        
    }
}

// Begin cycle of slideshow images
function beginCycle(image_type){
    const data = { test: "123" };

    // var images = []
    // console.log(document.getElementById('current_img').src)
    // var file_path = document.getElementById('current_img').src.toString().split('/')
    // console.log(file_path.slice(-1))
    // console.log(image_type)
    // document.getElementById('current_img').src
    // if(image_type == 'stefan'){
    // }
}


// const img_count


function getImgCount(){
    fetch(URL_PREFIX + "/count", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    }, body: JSON.stringify({
       test: "test"
    })
    }).then((response)=> {
        if (response.ok) {
            response.json().then(img_count_res => {
              sessionStorage.setItem("img_count", parseInt(img_count_res['file_count']))
            });
        }
    })
}

function getTasks(){
    // Fetch the necessary data
    // fetch("http://192.168.1.160:49160/list-tasks", {
    fetch(URL_PREFIX + "/list-tasks", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    }, body: JSON.stringify({
       test: "test"
    })
    }).then((response)=> {
        if (response.ok) {
            response.json().then(tasks_list => {
            sessionStorage.setItem("tasks_list",JSON.stringify(tasks_list))
            fetch(URL_PREFIX + "/list-tasks-status", {
            // fetch("http://192.168.1.160:49160/list-tasks-status", {
            // fetch("http://localhost:8000/list-tasks-status", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }, body: JSON.stringify({
                test: "test"
                })
                }).then((response)=> {
                    if (response.ok) {
                        response.json().then(tasks_list => {
                            sessionStorage.setItem("tasks_list_status",JSON.stringify(tasks_list))
                            
                            var currentDate = new Date();
                            var startDate = new Date(currentDate.getFullYear(), 0, 1);
                            var days = Math.floor((currentDate - startDate) /
                                (24 * 60 * 60 * 1000));
                            
                            const week_number = Math.ceil(days / 7);
                            // var number_of_days_difference = Math.floor((new Date(current_date) - new Date(start_date)) / (1000 * 3600 * 24))
                            getTasksWeekly(week_number)
                            getTasksBiWeekly(week_number)
                            getTasksMonthly(week_number)
                            getTasksBiMonthly(week_number)
                            getTasksQuarterly(week_number)
                            getTasksBiannually(week_number)
                            getTasksYearly(week_number)
                            getTasksBiennialy(week_number)
                        });
                    }
                })
            });
        }
    })    
}

// Perform the operations to figure out what the tasks for the specific week are, and concatenate past/future tasks in a nice to use interface
function getTasksPeriodicity(periodicity){
    // console.log(periodicity, JSON.parse(sessionStorage.getItem("tasks_list"))['periodicity'][periodicity]['tasks'])
    return JSON.parse(sessionStorage.getItem("tasks_list"))['periodicity'][periodicity]['tasks']
}


function getTasksWeekly(current_week_number){
    var tasks = getTasksPeriodicity('weekly')
    // Weekly tasks appear every week
    appendTaskToDom('weekly', tasks)
}

function getTasksBiWeekly(current_week_number){
    var tasks = getTasksPeriodicity('biweekly')
    // Weekly tasks appear every second week
    if((current_week_number - start_date_week_number) % 2 === 0){
        appendTaskToDom('biweekly', tasks)
    }
    // console.log(current_date)
    // console.log(start_date)
    // console.log('date diff' ,
    // start_date
    // if(current_week_number % 2 === 0){
        // appendTaskToDom(tasks)
    // }
}
function getTasksMonthly(current_week_number){
    var tasks = getTasksPeriodicity('monthly')
        // Weekly tasks appear every fourth week   
        if((current_week_number - start_date_week_number) % 4 === 0){
            appendTaskToDom('monthly', tasks)
        }
}
function getTasksBiMonthly(current_week_number){
    var tasks = getTasksPeriodicity('bimonthly')
    // Weekly tasks appear every eighth week

    if((current_week_number - start_date_week_number) % 8 === 0){
        appendTaskToDom('bimonthly', tasks)
    }
}
function getTasksQuarterly(current_week_number){
    var tasks = getTasksPeriodicity('quarterly')
    if((current_week_number - start_date_week_number) % 13 === 0){
        appendTaskToDom('quarterly', tasks)
    }

}
function getTasksBiannually(current_week_number){
    var tasks = getTasksPeriodicity('biannually')
    if((current_week_number - start_date_week_number) % 26 === 0){
        appendTaskToDom('biannually', tasks)
    }

}
function getTasksYearly(current_week_number){
    var tasks = getTasksPeriodicity('yearly')
    if((current_week_number - start_date_week_number) % 52 === 0){
        if(new Date(current_date).getFullYear() - new Date(start_date).getFullYear() >0){
                appendTaskToDom('yearly', tasks)

        }
    }

}
function getTasksBiennialy(current_week_number) {
    var tasks = getTasksPeriodicity('biennially')
    // console.log(new Date(start_date).getFullYear())
    if ((current_week_number - start_date_week_number) % 52 === 0) {
        if ((new Date(current_date).getFullYear() - new Date(start_date).getFullYear()) % 2 === 0) {
            appendTaskToDom('biennially', tasks)

        }
    }
}

function appendTaskToDom(periodicity, task_list){
    console.log(task_list)
    Object.entries(task_list).forEach(task =>{
        const [task_id, task_text] = task;
        const node = document.createElement("div")
        node.className = 'task_element'
        const button = document.createElement("button");
        button.className = "btn btn-primary"
        button.innerHTML = task_text
        button.setAttribute('task_id', task_id)
        button.setAttribute('task_periodicity', periodicity)
        button.onclick = function(){
            console.log(task_id)
            console.log(periodicity)
        }
        node.appendChild(button);
        document.getElementById("current_tasks").appendChild(node)
        document.getElementById("current_tasks").appendChild(document.createElement("br"))
    })
}

function appendFutureTaskToDom(task_list){


    Object.entries(task_list).forEach(task =>{
        const [task_id, task_text] = task;
        const node = document.createElement("div")
        const textnode = document.createTextNode(task_text);
        node.appendChild(textnode);
        document.getElementById("upcoming_tasks").appendChild(node)
    })
}
    
    



