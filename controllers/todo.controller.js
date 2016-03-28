'use strict'

const express = require('express')
const app = express()
const Todo = require('../models/todo.model')

module.exports = {
  loadTodos (req, res) {
    // console.log('in loadTodos')
    Todo.find({isRemoved: false}, (err, todos) => {
      if (err) throw err
      // console.log('todos in loadTodos', todos)
      res.send(todos)
    })
  },

  index (req, res) {
    // console.log('in home')
    res.render('index')
  },

  createTodo (req, res) {
    console.log('req.body', req.body)
      Todo.create(req.body, (err, data) => {
      if (err) throw err;
      console.log('created data', data)
    })
  },

  updateTodo (req, res) {
    // const updateCompleted = !(JSON.parse(req.body.isCompleted))
    const toRemove = JSON.parse(req.body.time)
    console.log('req.body',req.body)
    console.log('req.body.time', req.body.time)
    Todo.findOneAndUpdate({time: req.params.todoID}, {isRemoved: true}, {new: true}, function (err, doc) {
      if (err) {
        throw err
      }
      console.log('updated doc', doc)
    })
  },

  deleteTodo (req, res) {
    const updateRemoved = !(JSON.parse(req.body.isRemoved))
    Todo.findOneAndUpdate({_id: req.params.todoID}, {isRemoved: updateRemoved}, {new: true}, function (err, doc) {
      if (err) {
        console.log(err)
      }
      console.log('"deleted" doc', doc)
    })
  }
}
