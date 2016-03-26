'use strict';

var TodoApp = React.createClass({
  displayName: 'TodoApp',

  loadTodos: function loadTodos() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, error) {
        console.error(this.props.url, status, error.toString());
      }.bind(this)
    });
  },
  // add a todo code here
  // handleTodoSubmit
  // on page load default
  getInitialState: function getInitialState() {
    return { data: [] };
  },
  // component mount load todos
  componentDidMount: function componentDidMount() {
    this.loadTodos();
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'h1',
        null,
        'Todos'
      ),
      React.createElement(TodoAdd, { onTodoSubmit: this.handleTodoSubmit }),
      React.createElement(TodosList, { data: this.state.data })
    );
  }
});

// add todo form
var TodoAdd = React.createClass({
  displayName: 'TodoAdd',

  getInitialState: function getInitialState() {
    return { todo: '' };
  },
  handleTodoChange: function handleTodoChange(event) {
    this.setState({ todo: event.target.value });
  },
  handleTodoSubmit: function handleTodoSubmit(event) {
    var todo = this.state.todo.trim();
    event.preventDefault();
    if (!todo) {
      return;
    }
    this.props.onTodoSubmit({ todo: todo });
    this.setState({ todo: '' });
  },
  render: function render() {
    return React.createElement(
      'form',
      { onSubmit: this.handleTodoSubmit },
      React.createElement('input', { type: 'text', className: 'form-control', placeholder: 'Write a todo item here', value: this.state.todo, onChange: this.handleTodoChange }),
      React.createElement(
        'button',
        { type: 'submit', className: 'btn btn-default' },
        'Add Todo'
      )
    );
  }
});

// todo list
// should be a ul

// each todo
// should be a li
