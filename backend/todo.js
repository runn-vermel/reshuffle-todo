import { get, create, remove, update } from "@reshuffle/db";

/* @expose */
export async function addNewTodo(todo = {}) {
  // check if a todolist exists.
  return getTodoList().then(list => {
    if (list) {
      // if exists then update list with new todo
      return update("todos", todolist => todolist.concat(todo));
    } else {
      // if doesn't exist then create new todo array
      return create("todos", [todo]).then(() => getTodoList());
    }
  });
}

/* @expose */
export async function getTodoList() {
  // get all todolist
  return get("todos");
}

/* @expose */
export async function deleteTodoById(id) {
  // delete specific todo
  return update("todos", (todolist = []) =>
    // what you will return here will be directly updated in backend and returned in frontend
    todolist.filter(todo => todo.id !== id)
  );
}

/* @expose */
export async function deleteTodo() {
  // delete all todo
  return remove(`todos`).then(condition => {
    return getTodoList();
  });
}

/* @expose */
export async function changeTodoCheckedState(id) {
  return update("todos",(todolist = []) => {
    let changedTodo = todolist.find(td => td.id === id);
    return todolist
    .map(todoItem => {
      if (todoItem.id === id) {
        return {...changedTodo, checked: !changedTodo.checked}
      } else {
        return todoItem
      }
    })
  })
}
