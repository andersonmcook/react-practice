'use strict'
// dependencies
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
// routes
const todoRoutes = require('./routes/todo.routes')
// mongodb info
const PORT = process.env.PORT || 3000
const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost'
const MONGODB_PORT = process.env.MONGODB_PORT || 27017
const MONGODB_USER = process.env.MONGODB_USER || ''
const MONGODB_PASS = process.env.MONGODB_PASS || ''
const MONGODB_DB = 'react-todos'
const MONGODB_URL_PREFIX = MONGODB_USER ? `${MONGODB_USER}:${MONGODB_PASS}@` : ''
const MONGODB_URL = `mongodb://${MONGODB_URL_PREFIX}${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DB}`
// view engine
app.set('view engine', 'jade')
// use body-parser
app.use(bodyParser.urlencoded({extended: false}))
// use static assets
app.use(express.static('public'))
// use route module
app.use(todoRoutes)
// connect to db and then listen
mongoose.connect(MONGODB_URL, (err) => {
  if (err) throw err
  app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`)
  })
})
