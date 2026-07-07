export function project(name) {
    const _todos = []

    return {
        name,

        addTodo(todoObj) {
            _todos.push(todoObj)
        },

        readTodos() {
            return [..._todos]
        },

        getTodo(index) {
            return _todos[index]
        },

        deleteTodo(index) {
            _todos.splice(index, 1)
        }
    }
}