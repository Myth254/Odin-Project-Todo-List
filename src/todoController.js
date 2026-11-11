import { Project } from './projects.js'
import { Todo } from './todo.js'

const TodoController = (() => {
    const projects = []

    const createProject = (projectName) => {
        if (!projectName) return

        const todo1 = new Todo('Todo 1', 'Your first auto generated todo', '2027-01-01', 'low', 'N/A')
        projects.push(new Project(projectName, todo1))
    }

    const createTodo = (projectId, title, description = '', dueDate = 'N/A', priority = '', notes = 'N/A') => {
        const currentProject = projects.find(project => project.id === projectId)

        if (!currentProject) return
        if (!title) return

        const newTodo = new Todo(title, description, dueDate, priority, notes)
        currentProject.addTodo(newTodo)
    }

    const showproject = (projectId) => {
        return projects.find(project => project.id === projectId)
    }

    const showTodos = () => {
        for (const project of projects) {
            project.todos.forEach(todo => {
                console.log(`--- ${todo.title} ---`);
                console.log(`Due Date: ${todo.formattedDueDate}`); 
                console.log(`Status: ${todo.timeStatus}`);       
                console.log(`Is Overdue?: ${todo.isOverdue}`); 
            });
        }
    }

    const getProjects = () => {
        return [...projects]
    }

    const deleteTodo = (projectId, todoId) => {
        const currentProject = projects.find(project => project.id === projectId)
        if (!currentProject) return

        const todoIndex = currentProject.todos.findIndex(todo => todo.id === todoId)
        if (todoIndex !== -1) currentProject.todos.splice(todoIndex, 1)
    }

    const deleteProject = (projectId) => {
        const projectIndex = projects.findIndex(project => project.id === projectId)
        if (projectIndex !== -1) projects.splice(projectIndex, 1)
    }

    const getSortedTodos = (projectId) => {
        const project = projects.find(project => project.id === projectId)
        if (!project || !project.todos) return []

        return project.todos.slice().sort((todoA, todoB) => {
            return todoA.rawDueDateTimestamp - todoB.rawDueDateTimestamp
        })
    }

    return {
        createProject,
        createTodo,
        showproject,
        showTodos,
        getProjects,
        deleteTodo,
        deleteProject,
        getSortedTodos
    }
})()

export { TodoController }