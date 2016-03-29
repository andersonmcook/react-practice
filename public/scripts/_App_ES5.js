'use strict';

var TodoList = React.createClass({
  displayName: 'TodoList',

  render: function render() {
    var _this = this;

    var todos = this.props.items.map(function (todo, index) {
      return React.createElement(
        'li',
        { key: index, dataId: todo.time, className: 'list-group-item clearfix' },
        React.createElement(
          'div',
          { className: 'pull-left' },
          todo.todo
        ),
        React.createElement(
          'div',
          { className: 'btn-group pull-right' },
          React.createElement(
            'button',
            { className: 'btn btn-success', onClick: _this.props.deleteTodo, dataId: todo.time, value: index },
            'Done'
          )
        )
      );
    });
    return React.createElement(
      'ul',
      { className: 'list-group' },
      todos
    );
  }
});

var TodoApp = React.createClass({
  displayName: 'TodoApp',

  getInitialState: function getInitialState() {
    return {
      items: [],
      todo: ''
    };
  },
  componentDidMount: function componentDidMount() {
    this.loadTodos();
  },

  loadTodos: function loadTodos() {
    $.ajax({
      url: this.props.url,
      cache: false,
      success: function (data, status, xhr) {
        this.setState({ items: data });
      }.bind(this),
      error: function (xhr, status, error) {
        console.error(this.props.url, status, error.toString());
      }.bind(this)
    });
  },

  deleteTodo: function deleteTodo(e) {
    var todoIndex = parseInt(e.target.value);
    var todo = this.state.items[todoIndex];
    todo.isRemoved = true;
    var items = this.state.items;
    var updatedItems = items.filter(function (el, index) {
      return index !== todoIndex;
    });
    this.setState({ items: updatedItems });
    $.ajax({
      url: '/api/todos/' + todo.time,
      type: 'POST',
      data: todo,
      success: function (data, status, xhr) {
        this.setState({ items: updatedItems });
      }.bind(this),
      error: function (xhr, status, error) {
        this.setState({ items: items });
        console.error(this.props.url, status, error.toString());
      }.bind(this)
    });
  },

  onChange: function onChange(e) {
    this.setState({ todo: e.target.value });
  },

  addTodo: function addTodo(e) {
    e.preventDefault();
    var input = this.state.todo.trim();
    var items = this.state.items;
    if (input) {
      var todo = { todo: input, isRemoved: false, time: Date.now() };
      this.setState({ items: items.concat([todo]) });
      $.ajax({
        url: this.props.url,
        type: 'POST',
        data: todo,
        success: function (data) {
          this.setState({ items: items.concat([data]) });
        }.bind(this),
        error: function (xhr, status, error) {
          this.setState({ items: items });
          console.error(this.props.url, status, error.toString());
        }.bind(this)
      });
      this.setState({ todo: '' });
    }
  },

  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'h1',
        null,
        ' My Todos '
      ),
      React.createElement(
        'form',
        { className: 'form-inline', onSubmit: this.addTodo },
        React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement('input', { type: 'text', className: 'form-control', placeholder: 'Write a todo item here', value: this.state.todo, onChange: this.onChange })
        ),
        React.createElement(
          'button',
          { type: 'submit', className: 'btn btn-default' },
          'Add Todo'
        )
      ),
      React.createElement(
        'h4',
        null,
        'Todo List'
      ),
      React.createElement(TodoList, { items: this.state.items, deleteTodo: this.deleteTodo })
    );
  }
});

React.render(React.createElement(TodoApp, { url: 'api/todos' }), document.getElementById('todoapp'));
