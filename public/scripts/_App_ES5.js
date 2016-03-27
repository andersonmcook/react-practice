'use strict';
// todo app with form and list of todos

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

  handleTodoSubmit: function handleTodoSubmit(todo) {
    var todos = this.state.data;
    todo.isCompleted = false;
    todo.isRemoved = false;
    var newTodos = todos.concat([todo]);
    this.setState({ data: newTodos });
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: todo,
      success: function (data) {
        this.setState({ data: todos });
      }.bind(this),
      error: function (xhr, status, error) {
        console.error(this.props.url, status, error.toString());
      }.bind(this)
    });
  },
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
        'My Todos'
      ),
      React.createElement(TodoAdd, { onTodoSubmit: this.handleTodoSubmit }),
      React.createElement(TodoList, { data: this.state.data })
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
      'div',
      null,
      React.createElement(
        'form',
        { className: 'form-inline', onSubmit: this.handleTodoSubmit },
        React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement('input', { type: 'text', className: 'form-control', placeholder: 'Write a todo item here', value: this.state.todo, onChange: this.handleTodoChange })
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
      )
    );
  }
});

// todo list
// should be a ul
var TodoList = React.createClass({
  displayName: 'TodoList',

  render: function render() {
    console.log('data', this.props.data);
    var todos = this.props.data.map(function (todo) {
      return React.createElement(
        Todo,
        { key: todo._id, id: todo._id, isCompleted: todo.isCompleted },
        todo.todo
      );
    });
    return React.createElement(
      'ul',
      { className: 'list-group' },
      todos
    );
  }
});

// each todo
// should be a li
var Todo = React.createClass({
  displayName: 'Todo',

  render: function render() {
    // console.log('this.props', this.props)
    return React.createElement(
      'li',
      { key: this.props.id, id: this.props.id, className: 'list-group-item clearfix' },
      React.createElement(
        'div',
        { className: 'pull-left' },
        this.props.children
      ),
      React.createElement(
        'div',
        { className: 'btn-group pull-right' },
        React.createElement(TodoCompleteCheck, { dataId: this.props.id, isCompleted: this.props.isCompleted }),
        React.createElement(
          'button',
          { type: 'button', className: 'btn btn-danger' },
          React.createElement('span', { className: 'glyphicon glyphicon-remove' })
        )
      )
    );
  }
});

//<button type="button" className='btn btn-success'><span className='glyphicon glyphicon-ok'></span></button>

// todo checkmark
var TodoCompleteCheck = React.createClass({
  displayName: 'TodoCompleteCheck',

  getInitialState: function getInitialState() {
    return { isCompleted: false, dataId: '' };
  },
  componentDidMount: function componentDidMount() {
    // console.log('this.props', this.props)
    this.setState({ isCompleted: this.props.isCompleted, dataId: this.props.dataId });
  },
  handleClick: function handleClick(todo) {
    // console.log('click todo', todo)
    // console.log('click this.props', this.props)
    // console.log('cick this.state', this.state)
    // const todos = this.state
    // todo.isCompleted = !todo.isCompleted
    // const newTodos = todos.concat([todo])
    // this.setState({data: newTodos})
    $.ajax({
      url: '/api/todos/' + this.props.dataId,
      dataType: 'json',
      type: 'POST',
      data: this.state,
      success: function (data) {
        // this.setState({data: todos})
        console.log('data', data);
        console.log('success');
      }.bind(this),
      error: function (xhr, status, error) {
        console.error(xhr, status, error.toString());
      }.bind(this)
    });
    // console.log('check click before', this.state.isCompleted)
    this.setState({ isCompleted: !this.state.isCompleted });
    // console.log('check click after', !this.state.isCompleted)
  },
  render: function render() {
    var glyphicon = this.state.isCompleted ? 'glyphicon glyphicon-repeat' : 'glyphicon glyphicon-ok';
    var color = this.state.isCompleted ? 'btn btn-warning' : 'btn btn-success';
    return React.createElement(
      'button',
      { dataId: this.state.dataId, type: 'button', className: color, onClick: this.handleClick },
      React.createElement('span', { className: glyphicon })
    );
  }
});
// end todo checkmark

ReactDOM.render(React.createElement(TodoApp, { url: '/api/todos' }), document.getElementById('todoapp'));
