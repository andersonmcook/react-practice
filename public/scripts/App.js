'use strict'

const TaskList = React.createClass({
  render: function(){
    const todos = this.props.items.map((task, taskIndex) => {
      return (
       <li key={taskIndex} dataId={task.time} className='list-group-item clearfix'>
          <div className='pull-left'>{task.todo}</div>
          <div className='btn-group pull-right'>
            <button className='btn btn-success' onClick={this.props.deleteTask} dataId={task.time} value={taskIndex}>Done</button>
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
 });

const TaskApp = React.createClass({
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

  deleteTask: function(e) {
    const taskIndex = parseInt(e.target.value)
    const todo = this.state.items[taskIndex]
    todo.isRemoved = true
    const updatedItems = this.state.items.filter((el, index) => {
      return index !== taskIndex
    })
    $.ajax({
      url: `/api/todos/${todo.time}`,
      type: 'POST',
      data: todo,
      success: function (data, status, xhr) {
        console.log('handleclick data', data)
        this.setState({items: updatedItems})
      }.bind(this),
      error: function (xhr, status, error) {
        console.error(this.props.url, status, error.toString())
      }.bind(this)
    })
    // this.setState({items: updatedItems})
  },

  onChange: function(e) {
    this.setState({ todo: e.target.value });
  },

  addTask:function (e){
    //
    e.preventDefault();
    const input = this.state.todo.trim()
    if (input) {
      const todo = {todo: input, isRemoved: false, time: Date.now()}
      $.ajax({
        url: this.props.url,
        type: 'POST',
        data: todo,
        success: function (data) {
          console.log('success', data)
          this.setState({
            items: this.state.items.concat([todo]),
            todo: ''
          })
        }.bind(this),
        error: function (xhr, status, error) {
          console.error(this.props.url, status, error.toString())
        }.bind(this)
      })
      // this.setState({
      //   items: this.state.items.concat([todo]),
      //   todo: ''
      // })
    }
  },

  render: function(){
      return(
        <div>
          <h1> My Todos </h1>
          <form className='form-inline' onSubmit={this.addTask}>
            <div className='form-group'>
              <input type='text' className='form-control' placeholder='Write a todo item here' value={this.state.todo} onChange={this.onChange}/>
            </div>
            <button type='submit' className='btn btn-default'>Add Todo</button>
          </form>
          <h4>Todo List</h4>
          <TaskList items={this.state.items} deleteTask={this.deleteTask}/>
        </div>
      )
  }
})

React.render(<TaskApp url='api/todos'/>, document.getElementById('todoapp'))
