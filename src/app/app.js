const express = require('express')
const app = express()
const path = require("path") 
const port = 8000
const routes = require("./routes")
const fs = require("fs")

app.use(express.json());
app.use(express.static(path.join(__dirname, '../.', '')));
    
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
app.post('/count', (req, res) => {
        console.log(req.body)
        var test  = 'test'
        const options_thing = {}
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
app.use("/routes", routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


// Example post
// app.post('/some-api-endpoint', (req, res) => {
//     // test123
//     console.log(req.body)
//     // send some response
//     var options = {'asdf': 'asdf'}
//     res.json(options)
// });