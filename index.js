const express = require('express')
const fs = require('fs')
const app = express()
const path = require("path");



app.get('/video/:video', (req, res) => {
   const videoPath = path.join(__dirname, "videos", req.params.video);
   const videoSize = fs.statSync(videoPath).size;
   
   const headers = {
       "Content-Length": videoSize,
       "Content-Type": "video/mp4",
   };
   res.writeHead(200, headers);
   
   const videoStream = fs.createReadStream(videoPath);
   videoStream.pipe(res);
})

app.get('/', function (req, res) {
   res.send('Ekin <3')
})

app.listen(3169)