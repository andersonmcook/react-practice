'use strict';

const express = require('express');
const router = express.Router();
const todoCtrl = require('../controllers/todo.controller');

router.get('/', todoCtrl.index)
router.get('/api/todos', todoCtrl.loadTodos)
router.post('/api/todos', todoCtrl.createTodo)
router.post('/api/todos/:todoID', todoCtrl.updateTodo)

module.exports = router;
