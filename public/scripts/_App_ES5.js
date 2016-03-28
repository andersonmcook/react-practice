'use strict';

var TaskList = React.createClass({
  displayName: 'TaskList',

  render: function render() {
    var _this = this;

    var todos = this.props.items.map(function (task, taskIndex) {
      return React.createElement(
        'li',
        { key: taskIndex, dataId: task.time, className: 'list-group-item clearfix' },
        React.createElement(
          'div',
          { className: 'pull-left' },
          task.todo
        ),
        React.createElement(
          'div',
          { className: 'btn-group pull-right' },
          React.createElement(
            'button',
            { className: 'btn btn-success', onClick: _this.props.deleteTask, dataId: task.time, value: taskIndex },
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

var TaskApp = React.createClass({
  displayName: 'TaskApp',

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

  deleteTask: function deleteTask(e) {
    var taskIndex = parseInt(e.target.value);
    var todo = this.state.items[taskIndex];
    todo.isRemoved = true;
    var updatedItems = this.state.items.filter(function (el, index) {
      return index !== taskIndex;
    });
    $.ajax({
      url: '/api/todos/' + todo.time,
      type: 'POST',
      data: todo,
      success: function (data, status, xhr) {
        console.log('handleclick data', data);
        this.setState({ items: updatedItems });
      }.bind(this),
      error: function (xhr, status, error) {
        console.error(this.props.url, status, error.toString());
      }.bind(this)
    });
    // this.setState({items: updatedItems})
  },

  onChange: function onChange(e) {
    this.setState({ todo: e.target.value });
  },

  addTask: function addTask(e) {
    var _this2 = this;

    //
    e.preventDefault();
    var input = this.state.todo.trim();
    if (input) {
      (function () {
        var todo = { todo: input, isRemoved: false, time: Date.now() };
        $.ajax({
          url: _this2.props.url,
          type: 'POST',
          data: todo,
          success: function (data) {
            console.log('success', data);
            this.setState({
              items: this.state.items.concat([todo]),
              todo: ''
            });
          }.bind(_this2),
          error: function (xhr, status, error) {
            console.error(this.props.url, status, error.toString());
          }.bind(_this2)
        });
        // this.setState({
        //   items: this.state.items.concat([todo]),
        //   todo: ''
        // })
      })();
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
        { className: 'form-inline', onSubmit: this.addTask },
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
      React.createElement(TaskList, { items: this.state.items, deleteTask: this.deleteTask })
    );
  }
});

React.render(React.createElement(TaskApp, { url: 'api/todos' }), document.getElementById('todoapp'));
