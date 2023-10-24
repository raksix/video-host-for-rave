const express = require('express')
const fs = require('fs')
const app = express()
const path = require("path");


app.get('/video/:video', (req, res) => {
   const videoPath = path.join(__dirname, "videos", req.params.video);
   const videoSize = fs.statSync(videoPath).size;
   
   const CHUNK_SIZE = 10 ** 6; // Örnek olarak 1 MB

   const range = req.headers.range || "bytes=0-";
   const [start, end] = range.replace(/bytes=/, "").split("-");
   const startByte = parseInt(start, 10);
   const endByte = Math.min(startByte + CHUNK_SIZE, videoSize - 1);

   const contentLength = endByte - startByte + 1;

   const headers = {
       "Content-Type": "video/mp4",
       "Content-Length": contentLength,
       "Content-Range": `bytes ${startByte}-${endByte}/${videoSize}`,
       "Accept-Ranges": "bytes",
   };

   res.writeHead(206, headers);

   const readStream = fs.createReadStream(videoPath, { start: startByte, end: endByte, highWaterMark: CHUNK_SIZE });

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