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
    console.log('req.body', req.body)
      Todo.create(req.body, (err, data) => {
      if (err) throw err;
      console.log('created data', data)
      res.sendStatus(200)
    })
  },

  updateTodo (req, res) {
    const toRemove = JSON.parse(req.body.time)
    console.log('req.body', req.body)
    Todo.findOneAndUpdate({time: req.params.todoID}, {isRemoved: true}, {new: true}, function (err, doc) {
      if (err) throw err
      console.log('updated doc', doc)
      res.sendStatus(200)
    })
  }
}
