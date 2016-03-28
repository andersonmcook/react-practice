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
        // console.log('loadTodos', data)
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

  handleRemove: function handleRemove(event) {
    // console.log('remove click', event.target.value)
    console.log('remove click');
    // const todos = this.props.data.filter()
  },
  render: function render() {
    var _this = this;

    console.log('data', this.props.data);
    var todos = this.props.data.map(function (todo, index) {
      return React.createElement(Todo, { key: index, dataId: todo._id, isCompleted: todo.isCompleted, isRemoved: todo.isRemoved, handleRemove: _this.handleRemove, text: todo.todo });
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

  testClick: function testClick() {
    console.log('test click');
    console.log('clicked', this.props);
  },
  render: function render() {
    console.log('todo props', this.props);
    return React.createElement(
      'li',
      { key: this.props.key, dataId: this.props.dataId, isCompleted: this.props.isCompleted, isRemoved: this.props.isRemoved, className: 'list-group-item clearfix' },
      React.createElement(
        'div',
        { className: 'pull-left' },
        this.props.text
      ),
      React.createElement(
        'div',
        { className: 'btn-group pull-right' },
        React.createElement(TodoCompleteCheck, { dataId: this.props.dataId, isCompleted: this.props.isCompleted }),
        React.createElement(TodoRemoveCheck, { dataId: this.props.dataId, isRemoved: this.props.isRemoved, onClick: this.textClick })
      )
    );
  }
});

// EXAMPLE //////////////////////////////////////////////////////////////////////////////////////////////////////////

var TaskList = React.createClass({
  displayName: 'TaskList',

  deleteElement: function deleteElement() {
    console.log("remove");
  },

  render: function render() {
    var _this2 = this;

    var displayTask = function displayTask(task, taskIndex) {
      console.log("NEW ADDED TASK" + task);
      return React.createElement(
        'li',
        null,
        task,
        React.createElement(
          'button',
          { onClick: this.deleteElement },
          ' Delete '
        )
      );
    };
    return React.createElement(
      'ul',
      { className: 'list-group' },
      this.props.items.map(function (task, taskIndex) {
        return React.createElement(
          'li',
          { key: taskIndex, dataId: _this2.props.dataId, isCompleted: _this2.props.isCompleted, isRemoved: _this2.props.isRemoved, className: 'list-group-item clearfix' },
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
              { className: 'btn btn-success', onClick: _this2.props.deleteTask, value: taskIndex },
              React.createElement('span', { className: 'glyphicon glyphicon-ok' })
            )
          )
        );
      })
    );
  }
});
//
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
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({ items: data });
        console.log('loadTodos', data);
      }.bind(this),
      error: function (xhr, status, error) {
        console.error(this.props.url, status, error.toString());
      }.bind(this)
    });
  },

  deleteTask: function deleteTask(e) {
    var taskIndex = parseInt(e.target.value, 10);
    console.log('remove task: %d', taskIndex, this.state.items[taskIndex]);
    this.setState(function (state) {
      state.items.splice(taskIndex, 1);
      return { items: state.items };
    });
  },

  onChange: function onChange(e) {
    this.setState({ todo: e.target.value });
  },

  addTask: function addTask(e) {
    //
    this.state.isRemoved = false;
    // this.setState({data: newTodos})
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: this.state,
      success: function (data) {
        // this.setState({data: todos})
        console.log('success', data);
      }.bind(this),
      error: function (xhr, status, error) {
        console.error(this.props.url, status, error.toString());
      }.bind(this)
    });
    //
    console.log('addtask', this.state);
    this.setState({
      items: this.state.items.concat([this.state]),

      todo: ''
    });

    e.preventDefault();
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

// END EXAMPLE//////////////////////////////////////////////////////////////////////////////////

// todo checkmark
var TodoCompleteCheck = React.createClass({
  displayName: 'TodoCompleteCheck',

  getInitialState: function getInitialState() {
    return { isCompleted: false };
  },
  componentDidMount: function componentDidMount() {
    // console.log('this.props in todocompletecheck', this.props)
    // this.setState({isCompleted: this.props.isCompleted, dataId: this.props.dataId})
    this.setState({ isCompleted: this.props.isCompleted });
  },
  handleClick: function handleClick(todo) {
    console.log('click todo', todo);
    console.log('click this.props', this.props);
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
        console.log('handleclick data', data);
        console.log('success');
      }.bind(this),
      error: function (xhr, status, error) {
        console.error(this.props.url, status, error.toString());
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
      { dataId: this.props.dataId, type: 'button', className: color, onClick: this.handleClick },
      React.createElement('span', { className: glyphicon })
    );
  }
});
// end todo checkmark

// delete

var TodoRemoveCheck = React.createClass({
  displayName: 'TodoRemoveCheck',

  getInitialState: function getInitialState() {
    return { isRemoved: false };
  },
  componentDidMount: function componentDidMount() {
    // console.log('this.props in removecheck', this.props)
    // this.setState({isCompleted: this.props.isCompleted, dataId: this.props.dataId})
    this.setState({ isRemoved: this.props.isRemoved });
  },
  handleClick: function handleClick(todo) {
    console.log('todo', todo);
    console.log('handleClick in remove', this.props);
    console.log('this.state.data in remove', this.state.data);
    $.ajax({
      url: '/api/todos/delete/' + this.props.dataId,
      dataType: 'json',
      type: 'POST',
      data: this.state,
      success: function (data) {
        // this.setState({data: todos})
        console.log('handleclick data', data);
        console.log('success');
      }.bind(this),
      error: function (xhr, status, error) {
        console.error(this.props.url, status, error.toString());
      }.bind(this)
    });
    // console.log('check click before', this.state.isCompleted)
    this.setState({ isRemoved: !this.state.isRemoved });
    // console.log('check click after', !this.state.isCompleted)
  },
  render: function render() {
    return React.createElement(
      'button',
      { dataId: this.props.dataId, type: 'button', className: 'btn btn-danger', handleRemove: this.props.handleRemove },
      React.createElement('span', { className: 'glyphicon glyphicon-remove' })
    );
  }
});
// end delete

// ReactDOM.render(<TodoApp url='/api/todos'/>, document.getElementById('todoapp'))
