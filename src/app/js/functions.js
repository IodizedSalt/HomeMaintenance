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


// function addElement(){
//     const node = document.createElement("div")
//     const textnode = document.createTextNode("Clicked");
//     node.appendChild(textnode);
//     document.getElementsByTagName("body")[0].appendChild(node)
// }

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
    fetch("http://localhost:8000/count", {
    // fetch("http://192.168.1.160:49160/count", {
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
    fetch("http://localhost:8000/list-tasks", {
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
            });
        }
    })
    // fetch("http://192.168.1.160:49160/list-tasks-status", {
    fetch("http://localhost:8000/list-tasks-status", {
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
            });
        }
    })

    // Perform the operations to figure out what the tasks for the specific week are, and concatenate past/future tasks in a nice to use interface
    
    var currentDate = new Date();
    var startDate = new Date(currentDate.getFullYear(), 0, 1);
    var days = Math.floor((currentDate - startDate) /
        (24 * 60 * 60 * 1000));
    
    const weekNumber = Math.ceil(days / 7);

    getTasksWeekly(weekNumber)
    getTasksBiWeekly(weekNumber)
    getTasksMonthly(weekNumber)
    getTasksBiMonthly(weekNumber)
    getTasksQuarterly(weekNumber)
    getTasksBiannually(weekNumber)
    getTasksYearly(weekNumber)
    getTasksBiennial(weekNumber)
}

function getTasksPeriodicity(periodicity){
    return JSON.parse(sessionStorage.getItem("tasks_list"))['tasks']['periodicity'][periodicity]
}


function getTasksWeekly(current_week_number){
    // console.log(current_week_number)
    var tasks = getTasksPeriodicity('weekly')
    console.log(tasks)
    // console.log(JSON.parse(sessionStorage.getItem("tasks_list"))['tasks']['periodicity'])
}


function getTasksBiWeekly(current_week_number){
    var tasks = getTasksPeriodicity('biweekly')
    console.log(tasks)
}
function getTasksMonthly(current_week_number){
    var tasks = getTasksPeriodicity('monthly')
    console.log(tasks)
}
function getTasksBiMonthly(current_week_number){
    
}
function getTasksQuarterly(current_week_number){
    
}
function getTasksBiannually(current_week_number){
    
}
function getTasksYearly(current_week_number){
    
}
function getTasksBiennial(current_week_number){
}
    
    



