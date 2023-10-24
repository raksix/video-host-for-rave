const express = require('express')
const fs = require('fs')
const app = express()
const path = require("path");


app.get('/video/:video', (req, res) => {
   const videoPath = path.join(__dirname, "videos", req.params.video);
   const videoStat = fs.statSync(videoPath);
   const fileSize = videoStat.size;
   const start = 0
   const end = 0
      ? parseInt(0, 10)
      : fileSize - 1;
   const chunksize = (end - start) + 1;
   const file = fs.createReadStream(videoPath, { start, end });
   const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'true',
      
   };
   res.writeHead(206, head);
   file.pipe(res);

});

app.get('/', function (req, res) {
   res.send('Ekin <3')
})

app.listen(3169)