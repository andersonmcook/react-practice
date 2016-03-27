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
  handleTodoSubmit: function (todo) {
    const todos = this.state.data
    todo.isCompleted = false
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
    const todos = this.props.data.map(todo => {
      return (
        <Todo key={todo._id}>{todo.todo}</Todo>
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
    return (
      <li key={this.props._id} className='list-group-item'>{this.props.children}</li>
    )
  }
})

ReactDOM.render(<TodoApp url='/api/todos'/>, document.getElementById('todoapp'))
