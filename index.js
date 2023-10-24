const express = require('express')
const fs = require('fs')
const app = express()
const path = require("path");


app.get('/video/:video', (req, res) => {
   const videoPath = path.join(__dirname, "videos", req.params.video);
   const videoStat = fs.statSync(videoPath);
   const fileSize = videoStat.size;
   const videoRange = req.headers.range;
   if (videoRange) {
      const parts = videoRange.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1]
         ? parseInt(parts[1], 10)
         : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
         'Content-Range': `bytes ${start}-${end}/${fileSize}`,
         'Accept-Ranges': 'bytes',
         'Content-Length': chunksize,
         'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
   } else {
      const head = {
         'Content-Length': fileSize,
         'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
   }
});

app.get('/', function (req, res) {
   res.send('Ekin <3')
})

app.listen(3169)