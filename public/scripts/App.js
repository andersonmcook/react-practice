'use strict'
// todo app with form and list of todos
const TodoApp = React.createClass({
  loadTodos: function () {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({data: data})
        // console.log('loadTodos', data)
      }.bind(this),
      error: function (xhr, status, error) {
        console.error(this.props.url, status, error.toString())
      }.bind(this)
    })
  },

  handleTodoSubmit: function (todo) {
    const todos = this.state.data
    todo.isCompleted = false
    todo.isRemoved = false
    const newTodos = todos.concat([todo])
    this.setState({data: newTodos})
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: todo,
      success: function (data) {
        this.setState({data: todos})
      }.bind(this),
      error: function (xhr, status, error) {
        console.error(this.props.url, status, error.toString())
      }.bind(this)
    })
  },
  // on page load default
  getInitialState: function () {
    return {data: []}
  },
  // component mount load todos
  componentDidMount: function () {
    this.loadTodos()
  },
  render: function () {
    return (
      <div>
        <h1>My Todos</h1>
        <TodoAdd onTodoSubmit={this.handleTodoSubmit}/>
        <TodoList data={this.state.data}/>
      </div>
    )
  }
})

// add todo form
const TodoAdd = React.createClass({
  getInitialState: function () {
    return {todo: ''}
  },
  handleTodoChange: function (event) {
    this.setState({todo: event.target.value})
  },
  handleTodoSubmit: function (event) {
    const todo = this.state.todo.trim()
    event.preventDefault()
    if (!todo) {
      return
    }
    this.props.onTodoSubmit({todo: todo})
    this.setState({todo: ''})
  },
  render: function () {
    return (
      <div>
        <form className='form-inline' onSubmit={this.handleTodoSubmit}>
          <div className='form-group'>
            <input type='text' className='form-control' placeholder='Write a todo item here' value={this.state.todo} onChange={this.handleTodoChange}/>
          </div>
          <button type='submit' className='btn btn-default'>Add Todo</button>
        </form>
        <h4>Todo List</h4>
      </div>
    )
  }
})

// todo list
// should be a ul
const TodoList = React.createClass({
  render: function () {
    console.log('data', this.props.data)
    const todos = this.props.data.map((todo) => {
      return (
        <Todo key={todo._id} dataId={todo._id} isCompleted={todo.isCompleted} isRemoved={todo.isRemoved}>{todo.todo}</Todo>
      )
    })
    return (
      <ul className='list-group'>
        {todos}
      </ul>
    )
  }
})

// each todo
// should be a li
const Todo = React.createClass({
  render: function () {
    // console.log('todo props', this.props)
    return (
      <li key={this.props.key} dataId={this.props.dataId} isCompleted={this.props.isCompleted} isRemoved={this.props.isRemoved} className='list-group-item clearfix'>
        <div className='pull-left'>{this.props.children}</div>
        <div className='btn-group pull-right'>
            <TodoCompleteCheck dataId={this.props.dataId} isCompleted={this.props.isCompleted}/>
            <TodoRemoveCheck dataId={this.props.dataId} isRemoved={this.props.isRemoved}/>
        </div>
      </li>
    )
  }
})

            // <button type="button" className='btn btn-danger'><span className='glyphicon glyphicon-remove'></span></button>
//<button type="button" className='btn btn-success'><span className='glyphicon glyphicon-ok'></span></button>

// todo checkmark
const TodoCompleteCheck = React.createClass({
  getInitialState: function() {
    return {isCompleted: false};
  },
  componentDidMount: function () {
    // console.log('this.props in todocompletecheck', this.props)
    // this.setState({isCompleted: this.props.isCompleted, dataId: this.props.dataId})
    this.setState({isCompleted: this.props.isCompleted})
  },
  handleClick: function(todo) {
    console.log('click todo', todo)
    console.log('click this.props', this.props)
    // console.log('cick this.state', this.state)
    // const todos = this.state
    // todo.isCompleted = !todo.isCompleted
    // const newTodos = todos.concat([todo])
    // this.setState({data: newTodos})
    $.ajax({
      url: `/api/todos/${this.props.dataId}`,
      dataType: 'json',
      type: 'POST',
      data: this.state,
      success: function (data) {
        // this.setState({data: todos})
        console.log('handleclick data', data)
        console.log('success')
      }.bind(this),
      error: function (xhr, status, error) {
        console.error(this.props.url, status, error.toString())
      }.bind(this)
    })
    // console.log('check click before', this.state.isCompleted)
    this.setState({isCompleted: !this.state.isCompleted});
    // console.log('check click after', !this.state.isCompleted)
  },
  render: function() {
    const glyphicon = this.state.isCompleted ? 'glyphicon glyphicon-repeat' : 'glyphicon glyphicon-ok'
    const color = this.state.isCompleted ? 'btn btn-warning' : 'btn btn-success'
    return (
      <button dataId={this.props.dataId} type="button" className={color} onClick={this.handleClick}><span className={glyphicon}></span></button>
    )
  }
})
// end todo checkmark

// delete

const TodoRemoveCheck = React.createClass({
  getInitialState: function() {
    return {isRemoved: false};
  },
  componentDidMount: function () {
    // console.log('this.props in removecheck', this.props)
    // this.setState({isCompleted: this.props.isCompleted, dataId: this.props.dataId})
    this.setState({isRemoved: this.props.isRemoved})
  },
  handleClick: function(todo) {
    console.log('todo', todo)
    console.log('handleClick in remove', this.props)
    console.log('this.state.data in remove', this.state.data)
    $.ajax({
      url: `/api/todos/delete/${this.props.dataId}`,
      dataType: 'json',
      type: 'POST',
      data: this.state,
      success: function (data) {
        // this.setState({data: todos})
        console.log('handleclick data', data)
        console.log('success')
      }.bind(this),
      error: function (xhr, status, error) {
        console.error(this.props.url, status, error.toString())
      }.bind(this)
    })
    // console.log('check click before', this.state.isCompleted)
    this.setState({isRemoved: !this.state.isRemoved});
    // console.log('check click after', !this.state.isCompleted)
  },
  render: function() {
    return (
      <button dataId={this.props.dataId} type="button" className='btn btn-danger' onClick={this.handleClick}><span className='glyphicon glyphicon-remove'></span></button>
    )
  }
})
// end delete


ReactDOM.render(<TodoApp url='/api/todos'/>, document.getElementById('todoapp'))
