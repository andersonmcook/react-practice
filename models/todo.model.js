'use strict';

const mongoose = require('mongoose')

const Todo = mongoose.Schema({
  todo: String,
  isCompleted: Boolean,
  isRemoved: Boolean
})

module.exports = mongoose.model('Todos', Todo);
