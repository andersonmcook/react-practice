'use strict'

const express = require('express')
const app = express()
const Todo = require('../models/todo.model')

module.exports = {
  loadTodos (req, res) {
    Todo.find({isRemoved: false}, (err, todos) => {
      if (err) throw err
      res.send(todos)
    })
  },

  index (req, res) {
    res.render('index')
  },

  createTodo (req, res) {
      Todo.create(req.body, (err, data) => {
      if (err) throw err;
      res.send(data)
    })
  },

  updateTodo (req, res) {
    const todo = req.body
    Todo.findOneAndUpdate({time: req.params.todoID}, {isRemoved: todo.isRemoved, isCompleted: todo.isCompleted}, {new: true}, (err, data) => {
      if (err) throw err
      res.send(data)
    })
  }
}
