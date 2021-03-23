const express = require('express')
const mongoose = require('mongoose')
const { MONGODBURI } = require('./config/keys')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 5000

const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}
mongoose.connect(MONGODBURI,connectionParams)
    .then(() => {
        console.log('database connected!')
    })
    .catch(err => console.log(err));

app.use(express.json())
app.use(require('./router/auth'))
app.use(require('./router/post'))
app.use(require('./router/user'))

if(process.env.NODE_ENV==='production'){
    app.use(express.static(__dirname+'client/build'))
    app.get('*', (req,res) => {
        res.sendFile(path.join(__dirname+'client/build/index.html'))
    })
}

app.listen(PORT, () => {
    console.log('server is up and running on port ', process.env.PORT)
})

module.exports = app