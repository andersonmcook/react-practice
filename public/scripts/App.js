'use strict'

const TodoApp = React.createClass({
  loadTodos: function () {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({data: data})
      }.bind(this),
      error: function (xhr, status, error) {
        console.error(this.props.url, status, error.toString())
      }.bind(this)
    })
  },
  // add a todo code here
  // handleTodoSubmit
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
        <h1>Todos</h1>
        <TodoAdd onTodoSubmit={this.handleTodoSubmit}/>
        <TodosList data={this.state.data}/>
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
      <form onSubmit={this.handleTodoSubmit}>
        <input type='text' className='form-control' placeholder='Write a todo item here' value={this.state.todo} onChange={this.handleTodoChange}/>
        <button type='submit' className='btn btn-default'>Add Todo</button>
      </form>
    )
  }
})

// todo list
// should be a ul

// each todo
// should be a li
