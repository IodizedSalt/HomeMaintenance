function addElement(){
    const node = document.createElement("div")
    const textnode = document.createTextNode("Clicked");
    node.appendChild(textnode);
    document.getElementsByTagName("body")[0].appendChild(node)
}

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
    const data = { test: "123" };
    fetch("http://localhost:8000/count", {
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
