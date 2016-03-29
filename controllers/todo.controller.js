'use strict'

const express = require('express')
const app = express()
const Todo = require('../models/todo.model')

module.exports = {
  //finds todos in db that are marked isRemoved: false
  loadTodos (req, res) {
    Todo.find({isRemoved: false}, (err, todos) => {
      if (err) throw err
      res.send(todos)
    })
  },
  // render home page
  index (req, res) {
    res.render('index')
  },
  // adds todos
  createTodo (req, res) {
      Todo.create(req.body, (err, data) => {
      if (err) throw err;
      res.send(data)
    })
  },
  //updates todos to have isRemoved: true
  updateTodo (req, res) {
    Todo.findOneAndUpdate({time: req.params.todoID}, {isRemoved: true}, {new: true}, (err, data) => {
      if (err) throw err
      res.sendStatus(200)
    })
  }
}
