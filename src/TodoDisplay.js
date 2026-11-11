import { Todo } from './todo.js';
import { TodoController } from './todoController.js'

const TodoDisplay = (() => {
    let currentProjectId = null

    const projectListEl = document.getElementById('project-list')
    const todoListEl = document.getElementById('todo-list')
    const projectNameEl = document.getElementById('current-project-name')
    const addTodoBtn = document.getElementById('add-todo-btn')
    const todoModal = document.getElementById('todoModal')
    const todoForm = document.getElementById('todo-form')
    const closeModalBtn = document.getElementById('closeModalBtn')
    const todoTitle = document.getElementById('todoTitle')
    const todoDesc = document.getElementById('todoDesc')
    const dueDate = document.getElementById('dueDate')
    const todoPriority = document.getElementById('todoPriority')
    const todoNotes = document.getElementById('todoNotes')

    const renderProjects = () => {
        projectListEl.innerHTML = ''

        TodoController.getProjects().forEach(project => {
            const li = document.createElement('li')
            const deleteBtn = document.createElement('button')
            const projectBtn = document.createElement('button')

            projectBtn.textContent = project.pname
            projectBtn.classList.add('projectBtn')
            li.dataset.projectId = project.id
            deleteBtn.textContent = 'Delete'
            deleteBtn.classList.add('deleteBtn')
            li.appendChild(projectBtn)
            li.appendChild(deleteBtn)
            if (project.id === currentProjectId) li.classList.add('active')
            projectListEl.appendChild(li)
        });
    }

    const renderTodos = () => {
        todoListEl.innerHTML = ''

        if (!currentProjectId) {
            projectNameEl.textContent = 'Select a project'
            return
        }

        const project = TodoController.showproject(currentProjectId)
        if (!project) return

        projectNameEl.textContent = project.pname
        addTodoBtn.disabled = false

        const todos = TodoController.getSortedTodos(currentProjectId)
         if (todos.length === 0) {
            const emptyState = document.createElement('li')
            emptyState.classList.add('empty-state')
            emptyState.textContent = 'No todos yet. Add one to get started.'
            todoListEl.appendChild(emptyState)
            return
        }

        todos.forEach(todo => {
            const li = document.createElement('li')
            const content = document.createElement('div')
            const meta = document.createElement('div')
            const title = document.createElement('span')
            const description = document.createElement('p')
            const priority = document.createElement('span')
            const due = document.createElement('span')
            const notes = document.createElement('p')
            const deleteBtn = document.createElement('button')

            li.dataset.todoId = todo.id
            li.classList.add('todo-card', `priority-${todo.priority}`)
            if (todo.isOverdue) li.classList.add('overdue')
            
            content.classList.add('todo-content')
            meta.classList.add('todo-meta')
            title.classList.add('todo-title')
            description.classList.add('todo-description')
            priority.classList.add('todo-priority')
            due.classList.add('todo-status')
            notes.classList.add('todo-notes')
            deleteBtn.classList.add('delete-todo-btn')

            title.textContent = todo.title
            description.textContent = todo.description || 'No description'
            priority.textContent = todo.priority || 'No priority'
            due.textContent = todo.timeStatus
            notes.textContent = todo.notes || 'No notes'
            deleteBtn.textContent = 'Delete'

            meta.append(priority, due)
            content.append(title, description, meta, notes)
            li.append(content, deleteBtn)
            todoListEl.appendChild(li)
        })
    }

    const renderAll = () => {
        renderProjects()
        renderTodos()
    }

    const reset = () => {
        if (!TodoController.getProjects().length === 0) {
            currentProjectId = TodoController.getProjects()[0].id
            return
        }
        renderProjects()
        todoListEl.innerHTML = ''
        projectNameEl.textContent = 'Create a new project'
        addTodoBtn.disabled = true
    }

    const openTodoModal = () => {
        if (!currentProjectId) return
        todoForm.reset()
        todoModal.showModal()
        todoTitle.focus()
    }

    const closeTodoModal = () => {
        todoModal.close()
        todoForm.reset()
    }

    const createProjectBtn = document.getElementById('createProjectBtn')
    const createProjectValue = document.getElementById('createProjectValue')

    // --- Event delegation ---

    createProjectBtn.addEventListener('click', (e) => {
        e.preventDefault()
        const projectName = createProjectValue.value.trim()

        if (!projectName) return

        TodoController.createProject(projectName)
        const projects = TodoController.getProjects()
        currentProjectId = projects[projects.length - 1].id
        createProjectValue.value = ''

        renderAll()
    })

    projectListEl.addEventListener('click', (e) => {
        const li = e.target.closest('li')
        if (!li) return
        currentProjectId = li.dataset.projectId

        if (e.target.classList.contains('deleteBtn')) {
            TodoController.deleteProject(currentProjectId)
            reset()
        }

        renderAll()
    })

    addTodoBtn.addEventListener('click', openTodoModal)

    closeModalBtn.addEventListener('click', closeTodoModal)

    todoModal.addEventListener('click', (e) => {
        if (e.target === todoModal) closeTodoModal()
    })

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault()
        if (!currentProjectId) return

        TodoController.createTodo(
            currentProjectId,
            todoTitle.value.trim(),
            todoDesc.value.trim(),
            dueDate.value || 'N/A',
            todoPriority.value,
            todoNotes.value.trim() || 'N/A'
        )

        closeTodoModal()
        renderTodos()
    })

    todoListEl.addEventListener('click', (e) => {
        if (!e.target.matches('.delete-todo-btn')) return
        const li = e.target.closest('li')
        TodoController.deleteTodo(currentProjectId, li.dataset.todoId)
        renderTodos()
    })

    const init = () => {
        TodoController.createProject('My First Project')
        currentProjectId = TodoController.getProjects()[0].id
        renderAll()
    }

    return { init }
}) ()

export { TodoDisplay }