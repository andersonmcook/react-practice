'use strict'

const express = require('express')
const app = express()
const Todo = require('../models/todo.model')

module.exports = {
  loadTodos (req, res) {
    console.log('in loadTodos')
    Todo.find({isCompleted: false}, (err, todos) => {
    // Todo.find({}, (err, todos) => {
      if (err) throw err
      console.log('todos in loadTodos', todos)
      res.send(todos)
    })
  },

  index (req, res) {
    console.log('in home')
    res.render('index')
  },

  createTodo (req, res) {
    console.log('in create')
    console.log('req.body', req.body)
    // Todo.create({todo: 'completed task', isCompleted: true}, (err, data) => {
      Todo.create(req.body, (err, data) => {
      if (err) throw err;
      console.log('created data', data)
    })
  }
// // render answer
//   renderAnswer (req, res) {
//     Question.findOne({url: req.params.question}, (err, data) => {
//       if (err) throw err
//       if (data === null) {
//         res.redirect('/')
//       } else if (data.answerfont === undefined) {
//         console.log('in undefined options', data)
//         data.questioncolor = data.questioncolor || 'black'
//         data.answercolor = data.answercolor || 'black'
//         data.topcolor = data.topcolor || 'white'
//         data.bottomcolor = data.bottomcolor || 'white'
//         data.questionfont = data.questionfont || 'sans-serif'
//         data.answerfont = data.answerfont || 'sans-serif'

//         res.render('answer', {words: data})
//       } else {
//         res.render('answer', {words: data})
//       }
//     })
//   },

//   saveQA (req, res) {
//     Question.create(req.body, (err, data) => {
//       if (err) throw err;
//       res.redirect(`/${data.url}`)
//     })
//   },

//   form (req, res) {
//     res.render('form')
//   }
}
