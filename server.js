const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const db = require('./src/db')
const addUser = require('./src/controllers/add.user')
const getUsers = require('./src/controllers/get.users')
const addExercise = require('./src/controllers/add.exercise')
const getExerciseLog = require('./src/controllers/get.exerciseLog')

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})

app.post('/api/exercise/new-user', (req, res) => {
    addUser(req, res)
})

app.post('/api/exercise/add', (req, res) => {
    addExercise(req, res)
})

app.get('/api/exercise/log', (req, res) => {
    getExerciseLog(req, res)
})

app.get('/api/exercise/users', (req, res) => {
    getUsers(req, res)
})

/** Middleware. */

// Not found middleware
app.use((req, res, next) => {
    return next({ status: 404, message: 'not found' })
})

// Error Handling middleware
app.use((err, req, res, next) => {
    let errCode, errMessage

    if (err.errors) {
        // mongoose validation error
        errCode = 400 // bad request
        const keys = Object.keys(err.errors)
        // report the first validation error
        errMessage = err.errors[keys[0]].message
    } else {
        // generic or custom error
        errCode = err.status || 500
        errMessage = err.message || 'Internal Server Error'
    }
    res.status(errCode).type('txt').send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})
