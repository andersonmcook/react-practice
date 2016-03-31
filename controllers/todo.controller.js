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
    Todo.findOneAndUpdate({time: req.params.todoID}, {isRemoved: req.body.isRemoved, isCompleted: req.body.isCompleted}, {new: true}, (err, data) => {
      if (err) throw err
      // res.sendStatus(200)
      res.sendStatus(500)
    })
  }
}
