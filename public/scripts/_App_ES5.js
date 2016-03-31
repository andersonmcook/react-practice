'use strict';

var TodoList = React.createClass({
  displayName: 'TodoList',

  render: function render() {
    var _this = this;

    var todos = this.props.items.map(function (todo, index) {
      var completedButton = todo.isCompleted ? 'btn btn-warning' : 'btn btn-success';
      var completedText = todo.isCompleted ? 'Redo' : 'Complete';
      var todoText = todo.isCompleted ? { textDecoration: 'line-through', color: 'gray' } : { textDecoration: 'none' };
      return React.createElement(
        'li',
        { key: index, dataId: todo.time, className: 'list-group-item clearfix' },
        React.createElement(
          'div',
          { style: todoText, className: 'pull-left' },
          todo.todo
        ),
        React.createElement(
          'div',
          { className: 'btn-group pull-right' },
          React.createElement(
            'button',
            { className: completedButton, onClick: _this.props.completeTodo, dataId: todo.time, isCompleted: todo.isCompleted, value: index },
            completedText
          ),
          React.createElement(
            'button',
            { className: 'btn btn-danger', onClick: _this.props.deleteTodo, dataId: todo.time, value: index },
            'Remove'
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

  completeTodo: function completeTodo(e) {
    var todoIndex = parseInt(e.target.value);
    var todo = this.state.items[todoIndex];
    console.log(todo.isCompleted);
    todo.isCompleted = !todo.isCompleted;
    console.log(todo.isCompleted);
    var items = this.state.items;
    this.setState({ isCompleted: todo.isCompleted });
    $.ajax({
      url: '/api/todos/' + todo.time,
      type: 'POST',
      data: todo,
      success: function (data, status, xhr) {
        console.log('success', todo.isCompleted);
        this.setState({ isCompleted: todo.isCompleted });
      }.bind(this),
      error: function (xhr, status, error) {
        console.log('error', !todo.isCompleted);
        this.setState({ isCompleted: !todo.isCompleted });
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
      var todo = { todo: input, isRemoved: false, time: Date.now(), isCompleted: false };
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
      React.createElement(TodoList, { items: this.state.items, deleteTodo: this.deleteTodo, completeTodo: this.completeTodo })
    );
  }
});

ReactDOM.render(React.createElement(TodoApp, { url: 'api/todos' }), document.getElementById('todoapp'));
