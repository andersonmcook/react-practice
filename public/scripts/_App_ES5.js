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
            { className: completedButton, onClick: _this.props.completeTodo(todo.time), dataId: todo.time, isCompleted: todo.isCompleted, value: index },
            completedText
          ),
          React.createElement(
            'button',
            { className: 'btn btn-danger', onClick: _this.props.deleteTodo(todo.time), dataId: todo.time, value: index },
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

  completeTodo: function completeTodo(id) {
    var _this2 = this;

    return function (e) {
      var items = _this2.state.items;
      var todo = items.find(function (item) {
        return item.time === id;
      });
      todo.isCompleted = !todo.isCompleted;
      var todoIndex = items.indexOf(todo);
      _this2.setState({ items: _this2.todoSlice(items, todo, todoIndex) });
      $.ajax({
        url: '/api/todos/' + todo.time,
        type: 'POST',
        data: todo,
        success: function (data, status, xhr) {
          this.setState({ items: this.todoSlice(items, data, todoIndex) });
        }.bind(_this2),
        error: function (xhr, status, error) {
          this.setState({ items: items });
          console.error(this.props.url, status, error.toString());
        }.bind(_this2)
      });
    };
  },

  todoSlice: function todoSlice(array, todo, index) {
    var newArray = array.slice(0, index).concat([todo]).concat(array.slice(index + 1));
    return newArray;
  },

  deleteTodo: function deleteTodo(id) {
    var _this3 = this;

    return function (e) {
      var items = _this3.state.items;
      var todo = items.find(function (item) {
        return item.time === id;
      });
      todo.isRemoved = true;
      var todoIndex = items.indexOf(todo);
      var updatedItems = items.filter(function (el, index) {
        return index !== todoIndex;
      });
      _this3.setState({ items: updatedItems });
      $.ajax({
        url: '/api/todos/' + todo.time,
        type: 'POST',
        data: todo,
        success: function (data, status, xhr) {
          var dbItems = items.filter(function (el) {
            return el.time !== data.time;
          });
          this.setState({ items: dbItems });
        }.bind(_this3),
        error: function (xhr, status, error) {
          this.setState({ items: items });
          console.error(this.props.url, status, error.toString());
        }.bind(_this3)
      });
    };
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
    var incompleteTodos = this.state.items.filter(function (x) {
      return !x.isCompleted;
    });
    var completeTodos = this.state.items.filter(function (x) {
      return x.isCompleted;
    });
    var incompleteText = incompleteTodos.length > 0 ? 'Incomplete' : '';
    var completeText = completeTodos.length > 0 ? 'Complete' : '';
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
          React.createElement('input', { type: 'text', className: 'form-control pull-left', placeholder: 'Write a todo item here', value: this.state.todo, onChange: this.onChange })
        ),
        React.createElement(
          'button',
          { type: 'submit', className: 'btn btn-default', style: { marginLeft: '.75em' } },
          'Add Todo'
        )
      ),
      React.createElement(
        'h4',
        null,
        incompleteText
      ),
      React.createElement(TodoList, { items: incompleteTodos, deleteTodo: this.deleteTodo, completeTodo: this.completeTodo }),
      React.createElement(
        'h4',
        null,
        completeText
      ),
      React.createElement(TodoList, { items: completeTodos, deleteTodo: this.deleteTodo, completeTodo: this.completeTodo })
    );
  }
});

ReactDOM.render(React.createElement(TodoApp, { url: 'api/todos' }), document.getElementById('todoapp'));
