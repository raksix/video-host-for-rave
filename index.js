const express = require('express')
const fs = require('fs')
const app = express()
const path = require("path");


app.get('/video/:video', (req, res) => {
   const videoPath = path.join(__dirname, "videos", req.params.video);
   const videoSize = fs.statSync(videoPath).size;
   
   const CHUNK_SIZE = 10 ** 6; // Örnek olarak 1 MB
   
   const headers = {
       "Content-Type": "video/mp4",
   };
   res.writeHead(200, headers);

   const readStream = fs.createReadStream(videoPath, { highWaterMark: CHUNK_SIZE });

   readStream.on("data", (chunk) => {
       if (!res.write(chunk)) {
           readStream.pause();
       }
   });

   res.on("drain", () => {
       readStream.resume();
   });

   readStream.on("end", () => {
       res.end();
   });

   res.on("close", () => {
       readStream.destroy();
   });
});

app.get('/', function (req, res) {
   res.send('Ekin <3')
})

app.listen(3169)