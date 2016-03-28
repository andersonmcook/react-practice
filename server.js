'use strict'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Todo = require('./models/todo.model')
const todoCtrl = require('./controllers/todo.controller')

// routes
const PORT = process.env.PORT || 3000

const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost'
const MONGODB_PORT = process.env.MONGODB_PORT || 27017
const MONGODB_USER = process.env.MONGODB_USER || ''
const MONGODB_PASS = process.env.MONGODB_PASS || ''
const MONGODB_DB = 'todos';
const MONGODB_URL_PREFIX = MONGODB_USER ? `${MONGODB_USER}:${MONGODB_PASS}@` : ''
const MONGODB_URL = `mongodb://${MONGODB_URL_PREFIX}${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DB}`

// use jade
app.set('view engine', 'jade')

// use bodyParser
app.use(bodyParser.urlencoded({extended: false}))

// use static files
app.use(express.static('public'))


app.get('/', todoCtrl.index)

app.get('/api/todos', todoCtrl.loadTodos)

// post routes
app.post('/api/todos', todoCtrl.createTodo)

app.post('/api/todos/:todoID', todoCtrl.updateTodo)


mongoose.connect(MONGODB_URL, (err) => {
  // handle this better
  if (err) throw err;

  app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
  });

})
