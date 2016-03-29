'use strict'
// maps over items and renders todo list
const TodoList = React.createClass({
  render: function(){
    const todos = this.props.items.map((todo, index) => {
      return (
       <li key={index} dataId={todo.time} className='list-group-item clearfix'>
          <div className='pull-left'>{todo.todo}</div>
          <div className='btn-group pull-right'>
            <button className='btn btn-success' onClick={this.props.deleteTodo} dataId={todo.time} value={index}>Done</button>
          </div>
        </li>
      )
    })
    return (
      <ul className='list-group'>
        {todos}
      </ul>
    )
  }
 })
// todo app
const TodoApp = React.createClass({
  // blank initial state
  getInitialState: function(){
    return {
      items: [],
      todo: ''
    }
  },
  // once todoapp mounts then loadTodos
  componentDidMount: function () {
    this.loadTodos()
  },
  // makes ajax request to route to get todos from db
  loadTodos: function () {
    $.ajax({
      url: this.props.url,
      cache: false,
      success: function (data, status, xhr) {
        this.setState({items: data})
      }.bind(this),
      error: function (xhr, status, error) {
        console.error(this.props.url, status, error.toString())
      }.bind(this)
    })
  },
  // delete todo from virtual dom and then sends to db, if error goes back to previous items
  deleteTodo: function(e) {
    const todoIndex = parseInt(e.target.value)
    const todo = this.state.items[todoIndex]
    todo.isRemoved = true
    const items = this.state.items
    const updatedItems = items.filter((el, index) => {
      return index !== todoIndex
    })
    this.setState({items: updatedItems})
    $.ajax({
      url: `/api/todos/${todo.time}`,
      type: 'POST',
      data: todo,
      success: function (data, status, xhr) {
        this.setState({items: updatedItems})
      }.bind(this),
      error: function (xhr, status, error) {
        this.setState({items: items})
        console.error(this.props.url, status, error.toString())
      }.bind(this)
    })
  },
  // updates state based on todo input value
  onChange: function(e) {
    this.setState({ todo: e.target.value })
  },
  // add todo to virtual dom and then sends to db, if error goes back to previous items
  addTodo:function (e){
    e.preventDefault()
    const input = this.state.todo.trim()
    const items = this.state.items
    if (input) {
      const todo = {todo: input, isRemoved: false, time: Date.now()}
      this.setState({items: items.concat([todo])})
      $.ajax({
        url: this.props.url,
        type: 'POST',
        data: todo,
        success: function (data) {
          this.setState({items: items.concat([data])})
        }.bind(this),
        error: function (xhr, status, error) {
          this.setState({items: items})
          console.error(this.props.url, status, error.toString())
        }.bind(this)
      })
      this.setState({todo: ''})
    }
  },
// renders todo list
  render: function(){
      return(
        <div>
          <h1> My Todos </h1>
          <form className='form-inline' onSubmit={this.addTodo}>
            <div className='form-group'>
              <input type='text' className='form-control' placeholder='Write a todo item here' value={this.state.todo} onChange={this.onChange}/>
            </div>
            <button type='submit' className='btn btn-default'>Add Todo</button>
          </form>
          <h4>Todo List</h4>
          <TodoList items={this.state.items} deleteTodo={this.deleteTodo}/>
        </div>
      )
  }
})
// render to DOM
ReactDOM.render(<TodoApp url='api/todos'/>, document.getElementById('todoapp'))
