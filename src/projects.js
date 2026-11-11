export class Project {
    constructor (pname, ...todos) {
        this.id = crypto.randomUUID()
        this.pname = pname
        this.todos = todos
    }

    set projectName(newName) {
        this.pname = newName 
    }

    addTodo(todo) {
        this.todos.push(todo)
    }
}