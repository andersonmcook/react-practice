'use strict'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Todo = require('./models/todo.model')
const todoCtrl = require('./controllers/todo.controller')
// mongoose or postgres
// models
// controllers
// routes
const PORT = process.env.PORT || 3000

const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost'
const MONGODB_PORT = process.env.MONGODB_PORT || 27017
const MONGODB_USER = process.env.MONGODB_USER || ''
const MONGODB_PASS = process.env.MONGODB_PASS || ''
const MONGODB_DB = 'todos';
const MONGODB_URL_PREFIX = MONGODB_USER ? `${MONGODB_USER}:${MONGODB_PASS}@` : ''
const MONGODB_URL = `mongodb://${MONGODB_URL_PREFIX}${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DB}`

// db stuff

// use jade
app.set('view engine', 'jade')

// use bodyParser
app.use(bodyParser.urlencoded({
  extended: false
}))
// use static files
app.use(express.static('public'))

// default route
// app.get('/', (req, res) => {
//   res.render('index')
// })
app.get('/', todoCtrl.index)

// app.get('/api/todos', (req, res) => {
//   const data = [{todo: 'a thing', _id: 1}, {todo: 'a second thing', _id: 2}]
//   console.log('data', data)
//   res.send(data)
//   // console.log('data', JSON.parse(data))
//   // res.json(data)
// })

// app.get('/test', todoCtrl.create)

app.get('/api/todos', todoCtrl.loadTodos)

// post routes
app.post('/api/todos', todoCtrl.createTodo)


mongoose.connect(MONGODB_URL, (err) => {
  // handle this better
  if (err) throw err;

  app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
  });

})
