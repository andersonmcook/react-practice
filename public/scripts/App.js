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
  handleRemove: function (event) {
    // console.log('remove click', event.target.value)
    console.log('remove click')
    // const todos = this.props.data.filter()
  },
  render: function () {
    console.log('data', this.props.data)
    const todos = this.props.data.map((todo, index) => {
      return (
        <Todo key={index} dataId={todo._id} isCompleted={todo.isCompleted} isRemoved={todo.isRemoved} handleRemove={this.handleRemove} text={todo.todo}/>
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
  testClick: function () {
    console.log('test click')
    console.log('clicked', this.props)
  },
  render: function () {
    console.log('todo props', this.props)
    return (
      <li key={this.props.key} dataId={this.props.dataId} isCompleted={this.props.isCompleted} isRemoved={this.props.isRemoved} className='list-group-item clearfix'>
        <div className='pull-left'>{this.props.text}</div>
        <div className='btn-group pull-right'>
            <TodoCompleteCheck dataId={this.props.dataId} isCompleted={this.props.isCompleted}/>
            <TodoRemoveCheck dataId={this.props.dataId} isRemoved={this.props.isRemoved} onClick={this.textClick}/>
        </div>
      </li>
    )
  }
})

// EXAMPLE //////////////////////////////////////////////////////////////////////////////////////////////////////////

const TaskList = React.createClass({
  deleteElement:function(){
    console.log("remove");
  },

  render: function(){
    const displayTask  = function(task, taskIndex){
      console.log("NEW ADDED TASK"+task);
      return (
        <li>
          {task}
          <button onClick= {this.deleteElement}> Delete </button>
        </li>
      )
    }
    return (
      <ul className='list-group'>
        {this.props.items.map((task, taskIndex) =>
          <li key={taskIndex} dataId={task.time} className='list-group-item clearfix'>
            <div className='pull-left'>{task.todo}</div>
            <div className='btn-group pull-right'>
              <button className='btn btn-success' onClick={this.props.deleteTask} dataId={task.time} value={taskIndex}><span className='glyphicon glyphicon-ok'></span></button>
            </div>
          </li>
        )}
      </ul>
    )
  }
 });
//
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
        dataType: 'json',
        cache: false,
        success: function (data) {
          this.setState({items: data})
          console.log('loadTodos', data)
        }.bind(this),
        error: function (xhr, status, error) {
          console.error(this.props.url, status, error.toString())
        }.bind(this)
      })
    },

    deleteTask: function(e) {
      // console.log('this.state deelete' this.state)
        var taskIndex = parseInt(e.target.value, 10);
        const test = this.state.items[taskIndex]
        test.isRemoved = true
        console.log('test', test.time)
        console.log('this.props delete', this.state.items[taskIndex])
        console.log('remove task: %d', taskIndex, this.state.items[taskIndex]);
        //
        $.ajax({
          url: `/api/todos/${test.time}`,
          dataType: 'json',
          type: 'POST',
          data: test,
          success: function (data, status, xhr) {
            // this.setState({data: todos})
            console.log('status', status)
            console.log('xhr', xhr)
            console.log('handleclick data', data)
            console.log('success')
          }.bind(this),
          error: function (xhr, status, error) {
            console.error(this.props.url, status, error.toString())
          }.bind(this)
        })
        //
        this.setState(state => {
            state.items.splice(taskIndex, 1);
            return {items: state.items};
        });
    },

    onChange: function(e) {
        this.setState({ todo: e.target.value });
    },



    addTask:function (e){
      //
      e.preventDefault();
      // this.state.isRemoved = false
      // this.state.time = Date.now()
      // this.setState({data: newTodos})
      // this.setState({todo: e.target.value, isRemoved: false, time: Date.now()})
      const todo = {todo: this.state.todo, isRemoved: false, time: Date.now()}
      // console.log('addTask state', this.state)
      // $.post(this.props.url, todo, data => {
      //   console.log('data',data)
      // })
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        type: 'POST',
        data: todo,
        success: function (data) {
          // this.setState({data: todos})
          console.log('success', data)
          // this.setState({
          //   items: this.state.items.concat([this.state]),
          //   todo: ''
          // })
        }.bind(this),
        error: function (xhr, status, error) {
          console.error(this.props.url, status, error.toString())
        }.bind(this)
      })
      //
      console.log('addtask', this.state)
      this.setState({
        // items: this.state.items.concat([this.state]),
        items: this.state.items.concat([todo]),
        todo: ''
      })
      // e.preventDefault();
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

// END EXAMPLE//////////////////////////////////////////////////////////////////////////////////


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
      <button dataId={this.props.dataId} type="button" className='btn btn-danger' handleRemove={this.props.handleRemove}><span className='glyphicon glyphicon-remove'></span></button>
    )
  }
})
// end delete


// ReactDOM.render(<TodoApp url='/api/todos'/>, document.getElementById('todoapp'))
