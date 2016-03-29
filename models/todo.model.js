'use strict'

const mongoose = require('mongoose')
// model for data
const Todo = mongoose.Schema({
  todo: String,
  time: Number,
  isRemoved: Boolean
})

module.exports = mongoose.model('Todos', Todo)
