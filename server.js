'use strict'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
// mongoose or postgres
// models
// controllers
// routes
const PORT = process.env.PORT || 3000

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
app.get('/', (req, res) => {
  res.render('index')
})

// post routes


// connect database before listening

app.listen(PORT, ()=> {
  console.log(`App listening on Port ${PORT}`)
})
