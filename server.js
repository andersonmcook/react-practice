'use strict'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const todoRoutes = require('./routes/todo.routes')

// consider putting these into separate config file
const PORT = process.env.PORT || 3000
const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost'
const MONGODB_PORT = process.env.MONGODB_PORT || 27017
const MONGODB_USER = process.env.MONGODB_USER || ''
const MONGODB_PASS = process.env.MONGODB_PASS || ''
const MONGODB_DB = 'react-todos'
const MONGODB_URL_PREFIX = MONGODB_USER ? `${MONGODB_USER}:${MONGODB_PASS}@` : ''
const MONGODB_URL = `mongodb://${MONGODB_URL_PREFIX}${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DB}`

app.set('view engine', 'jade')

app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static('public'))

app.use(todoRoutes)

mongoose.connect(MONGODB_URL, (err) => {
  if (err) throw err
  app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`)
  })
})
