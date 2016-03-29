'use strict'

const express = require('express')
const router = express.Router()
const todoCtrl = require('../controllers/todo.controller')

// home route renders index page
router.get('/', todoCtrl.index)
// api request to load todos from db
router.get('/api/todos', todoCtrl.loadTodos)
// api request to create a new todo
router.post('/api/todos', todoCtrl.createTodo)
// api request to update a todo to isRemoved: true
router.post('/api/todos/:todoID', todoCtrl.updateTodo)

module.exports = router
