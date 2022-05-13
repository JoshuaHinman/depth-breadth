const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const index = fs.readFileSync('index.html')

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'/index.html'))
    //res.end(index)
})

let port = process.env.PORT
if (port == null || port == "") {
    port = 4000
}
app.listen(port, () => console.log('Server started'))