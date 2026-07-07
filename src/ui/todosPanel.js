// todosPanel.js
import { StateManager } from '../modules/appState.js';
import { el } from './domHelpers.js';
import { openTodoModal } from './todoModal.js';
import { createTodo } from '../modules/todo.js'; // Assuming your todo factory path
import { renderApp } from '../index.js';

/**
 * Draws the active task view screen inside the main viewport
 */
export function renderTodosPanel() {
  const contentDiv = document.querySelector('#content');
  if (!contentDiv) return;
  
  contentDiv.innerHTML = ''; // Reset container viewport

  const activeProject = StateManager.getActiveProject();
  
  // Header Panel Layout
  const headerLayout = el('div', { classes: ['todos-header-zone'] }, [
    el('h2', { textContent: activeProject.name }),
    el('button', { id: 'openAddTaskModalBtn', classes: ['btn-primary'], textContent: '+ Add Task' })
  ]);
  contentDiv.appendChild(headerLayout);

  const todos = activeProject.readTodos();

  if (todos.length === 0) {
    contentDiv.appendChild(el('p', { classes: ['empty-msg'], textContent: 'No tasks found here.' }));
    return;
  }

  // Generate task list container sheet
  const listWrapper = el('div', { classes: ['todos-list-wrapper'] });

  todos.forEach((todo, index) => {
    const isTodoComplete = todo.get();
    
    const rowNode = el(
      'div', 
      { 
        classes: ['todo-row', `priority-${todo.priority}`, isTodoComplete ? 'completed' : ''],
        // Identity Tracking Variable injected directly onto the row wrapper node
        'data-todo-index': index
      }, 
      [
        el('button', { 
          classes: ['toggle-todo-btn'], 
          textContent: isTodoComplete ? '✅' : '⭕' 
        }),
        el('div', { classes: ['todo-details-clickzone'] }, [
          el('span', { classes: ['todo-title'], textContent: todo.title }),
          todo.dueDate ? el('span', { classes: ['todo-date'], textContent: `📅 ${todo.dueDate}` }) : el('span')
        ]),
        el('button', { 
          classes: ['delete-todo-btn'], 
          textContent: '🗑️' 
        })
      ]
    );

    listWrapper.appendChild(rowNode);
  });

  contentDiv.appendChild(listWrapper);
}

/**
 * Sets up the static system delegation listener channels on the content layer
 */
export function initTodosEvents() {
  const contentDiv = document.querySelector('#content');

  if (contentDiv) {
    contentDiv.addEventListener('click', (event) => {
      // 1. Intercept the global context click trigger for adding tasks
      if (event.target.id === 'openAddTaskModalBtn') {
        openTodoModal({
          onSubmit: (formData) => {
            const newTodo = createTodo(formData);
            StateManager.getActiveProject().addTodo(newTodo);
            renderApp();
          }
        });
        return;
      }

      // 2. Identify targeting for individual task rows
      const todoRow = event.target.closest('.todo-row');
      if (!todoRow) return;

      const todoIndex = parseInt(todoRow.getAttribute('data-todo-index'), 10);
      const activeProject = StateManager.getActiveProject();
      const currentTodo = activeProject.getTodo(todoIndex);

      // 3. Delegate actions via classes
      if (event.target.classList.contains('toggle-todo-btn')) {
        // Toggle action
        currentTodo.toggleComplete();
        renderApp();
      } 
      else if (event.target.classList.contains('delete-todo-btn')) {
        // Delete action
        activeProject.deleteTodo(todoIndex);
        renderApp();
      } 
      else if (event.target.closest('.todo-details-clickzone')) {
        // Detail view / Edit window trigger
        openTodoModal({
          todo: currentTodo,
          index: todoIndex,
          onSubmit: (updatedData) => {
            // Apply mutated properties cleanly back into your model state
            currentTodo.title = updatedData.title;
            currentTodo.description = updatedData.description;
            currentTodo.dueDate = updatedData.dueDate;
            currentTodo.priority = updatedData.priority;
            currentTodo.notes = updatedData.notes;
            renderApp();
          }
        });
      }
    });
  }
}
