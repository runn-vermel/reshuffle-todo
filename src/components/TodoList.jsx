import React, { Component } from "react";
import { TextField, Button, Checkbox } from "@material-ui/core";
import "@reshuffle/code-transform/macro";
import { addNewTodo, getTodoList, deleteTodoById, changeTodoCheckedState } from "../../backend/todo";

class TodoList extends Component {
  state = {
    todoList: [],
    text: ""
  };

  componentWillMount() {
    // load existing todolist in app
    getTodoList().then((list = []) => {
      if (list) {
        this.setState({ todoList: list.reverse() });
      }
    });
  }

  generateRandomId = () => {
    return new Date().getTime();
  };

  handleChange = event => {
    if (event.key === "Enter") {
      this.handleAddTodo();
      return;
    }
    this.setState({
      text: event.target.value
    });
  };

  handleAddTodo = () => {
    let text = this.state.text;

    // prevent empty string to add in todo
    if (!text) return;

    // each todo will have it's own id which will be used to delete this todo in future
    addNewTodo({
      id: this.generateRandomId(),
      text,
      checked: false
    }).then(list => {
      // update app with new todo list
      this.setState({
        todoList: list.reverse(),
        text: ""
      });
    });
  };

  // delete todo by id
  handleDeleteTodo = id => {
    deleteTodoById(id).then(list => {
      if (list) {
        this.setState({
          todoList: list.reverse()
        });
      }
    });
  };

  handleCheckStateChange = id => {
    changeTodoCheckedState(id)
      .then(list => {
        this.setState({
          todoList: list.reverse()
        })
      })
  }
  render() {
    return (
      <div className="container">
        <h1>Todo List</h1>
        <div className="d-flex mt-4 ">
          <TextField
            value={this.state.text}
            fullWidth
            variant="outlined"
            onChange={this.handleChange}
            onKeyDown={this.handleChange}
          />
          <Button
            onClick={this.handleAddTodo}
            className="ml-3"
            variant="contained"
            color="primary"
          >
            Add
          </Button>
        </div>

        <div className="py-2" />

        {this.state.todoList.map(({ text, id, checked }) => (
          <div
            className="d-flex justify-content-between align-items-center py-2"
            key={text}
          >
            <div className="flex-grow-1 text-align-left">
              <span>
                <Checkbox
                checked={checked}
                onChange={()=>this.handleCheckStateChange(id)}
                ></Checkbox>
              </span>
              <span className={
                checked
                  ? "checked"
                  : null
              }>{text}</span>
            </div>
            <Button
              className="ml-3 my-button"
              variant="contained"
              color="secondary"
              onClick={() => this.handleDeleteTodo(id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    );
  }
}

export default TodoList;
