const express = require('express')
const app = express()

app.use('/video', express.static('videos'))


app.get('/', function (req, res) {
   res.send('Ekin <3')
})

app.listen(3169)