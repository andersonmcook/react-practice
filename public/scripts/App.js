'use strict'

// ideally each component would be in its own file
const TodoList = React.createClass({
  render: function(){
    const todos = this.props.items.map((todo, index) => {
      const completedButton = todo.isCompleted ? 'btn btn-warning' : 'btn btn-success'
      const completedText = todo.isCompleted ? 'Redo' : 'Complete'
      const todoText = todo.isCompleted ? {textDecoration: 'line-through', color: 'gray'} : {textDecoration: 'none'}
      return (
       <li key={index} dataId={todo.time} className='list-group-item clearfix'>
          <div style={todoText} className='pull-left'>{todo.todo}</div>
          <div className='btn-group pull-right'>
            <button className={completedButton} onClick={this.props.completeTodo(todo.time)} dataId={todo.time} isCompleted={todo.isCompleted} value={index}>{completedText}</button>
            <button className='btn btn-danger' onClick={this.props.deleteTodo(todo.time)} dataId={todo.time} value={index}>Remove</button>
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

const TodoApp = React.createClass({
  getInitialState: function(){
    return {
      items: [],
      todo: ''
    }
  },
  componentDidMount: function () {
    this.loadTodos()
  },

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

  completeTodo: function(id) {
    return (e) => {
      const items = this.state.items
      const todo = items.find(item => item.time === id)
      todo.isCompleted = !todo.isCompleted
      const todoIndex = items.indexOf(todo)
      this.setState({items: this.todoSlice(items, todo, todoIndex)})
      $.ajax({
        url: `/api/todos/${todo.time}`,
        type: 'POST',
        data: todo,
        success: function (data, status, xhr) {
          this.setState({items: this.todoSlice(items, data, todoIndex)})
        }.bind(this),
        error: function (xhr, status, error) {
          this.setState({items: items})
          console.error(this.props.url, status, error.toString())
        }.bind(this)
      })
    }
  },

  todoSlice: function (array, todo, index) {
    const newArray = array.slice(0, index).concat([todo]).concat(array.slice(index + 1))
    return newArray
  },

  deleteTodo: function(id) {
    return (e) => {
      const items = this.state.items
      const todo = items.find(item => item.time === id)
      todo.isRemoved = true
      const todoIndex = items.indexOf(todo)
      const updatedItems = items.filter((el, index) => {
        return index !== todoIndex
      })
      this.setState({items: updatedItems})
      $.ajax({
        url: `/api/todos/${todo.time}`,
        type: 'POST',
        data: todo,
        success: function (data, status, xhr) {
          const dbItems = items.filter(el => {
            return el.time !== data.time
          })
          this.setState({items: dbItems})
        }.bind(this),
        error: function (xhr, status, error) {
          this.setState({items: items})
          console.error(this.props.url, status, error.toString())
        }.bind(this)
      })
    }
  },

  onChange: function(e) {
    this.setState({ todo: e.target.value })
  },

  addTodo:function (e){
    e.preventDefault()
    const input = this.state.todo.trim()
    const items = this.state.items
    if (input) {
      const todo = {todo: input, isRemoved: false, time: Date.now(), isCompleted: false}
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

  render: function(){
    const incompleteTodos = this.state.items.filter(x => !x.isCompleted)
    const completeTodos = this.state.items.filter(x => x.isCompleted)
    const incompleteText = incompleteTodos.length > 0 ? 'Incomplete' : ''
    const completeText = completeTodos.length > 0 ? 'Complete' : ''
    return(
      <div>
        <h1> My Todos </h1>
        <form className='form-inline' onSubmit={this.addTodo}>
          <div className='form-group'>
            <input type='text' className='form-control pull-left' placeholder='Write a todo item here' value={this.state.todo} onChange={this.onChange}/>
          </div>
          <button type='submit' className='btn btn-default' style={{marginLeft: '.75em'}}>Add Todo</button>
        </form>
        <h4>{incompleteText}</h4>
        <TodoList items={incompleteTodos} deleteTodo={this.deleteTodo} completeTodo={this.completeTodo}/>
        <h4>{completeText}</h4>
        <TodoList items={completeTodos} deleteTodo={this.deleteTodo} completeTodo={this.completeTodo}/>
      </div>
    )
  }
})

ReactDOM.render(<TodoApp url='api/todos'/>, document.getElementById('todoapp'))
