'use strict'

const mongoose = require('mongoose')

const Todo = mongoose.Schema({
  todo: String,
  time: Number,
  isRemoved: Boolean,
  isCompleted: Boolean
})

module.exports = mongoose.model('Todos', Todo)
