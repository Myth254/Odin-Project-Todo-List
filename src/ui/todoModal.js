// todoModal.js
import { el } from './domHelpers.js';

/**
 * Opens a modal window to create or edit a todo item.
 * @param {Object|null} [todo=null] - The todo object to edit, or null for a new todo.
 * @param {number|null} [index=null] - The array index of the todo being edited.
 * @param {Function} onSubmit - Callback function that receives the final data object: (data, index) => {}
 */
export function openTodoModal({ todo = null, index = null, onSubmit }) {
  // 1. Determine Mode & Setup Values
  const isEditMode = todo !== null;
  const modalTitleText = isEditMode ? 'Edit Task' : 'Add New Task';
  
  // Custom form attribute tracking identity via data-* attributes
  const formAttributes = { id: 'todoForm' };
  if (isEditMode && index !== null) {
    formAttributes['data-todo-index'] = index;
  }

  // 2. Build the Body Form using semantic elements
  const formElement = el('form', formAttributes, [
    // Title Input
    el('div', { classes: ['form-group'] }, [
      el('label', { textContent: 'Title *' }),
      el('input', { 
        type: 'text', 
        name: 'title', 
        required: 'true', 
        value: isEditMode ? todo.title : '', 
        placeholder: 'What needs to be done?' 
      })
    ]),

    // Description Textarea
    el('div', { classes: ['form-group'] }, [
      el('label', { textContent: 'Description' }),
      el('textarea', { 
        name: 'description', 
        placeholder: 'Add details...'
      }), // Textarea text contents applied below for cross-browser safety
    ]),

    // Due Date Input
    el('div', { classes: ['form-group'] }, [
      el('label', { textContent: 'Due Date' }),
      el('input', { 
        type: 'date', 
        name: 'dueDate', 
        value: (isEditMode && todo.dueDate) ? todo.dueDate : '' 
      })
    ]),

    // Priority Dropdown Select
    el('div', { classes: ['form-group'] }, [
      el('label', { textContent: 'Priority' }),
      el('select', { name: 'priority' }, [
        el('option', { value: '1', textContent: 'Low (1)' }),
        el('option', { value: '2', textContent: 'Medium (2)' }),
        el('option', { value: '3', textContent: 'High (3)' })
      ])
    ]),

    // Notes Textarea
    el('div', { classes: ['form-group'] }, [
      el('label', { textContent: 'Notes' }),
      el('textarea', { 
        name: 'notes', 
        placeholder: 'Additional notes...' 
      })
    ])
  ]);

  // Pre-fill textarea values if editing (safest way across browser DOM layouts)
  if (isEditMode) {
    formElement.querySelector('[name="description"]').value = todo.description || '';
    formElement.querySelector('[name="notes"]').value = todo.notes || '';
    formElement.querySelector('[name="priority"]').value = todo.priority || '2';
  } else {
    // Default to medium priority for new tasks
    formElement.querySelector('[name="priority"]').value = '2';
  }

  // 3. Assemble the entire Modal Layout
  let overlayElement;

  const closeModal = () => {
    if (overlayElement) {
      overlayElement.remove();
    }
  };

  // Header Zone
  const headerZone = el('div', { classes: ['modal-header'] }, [
    el('h3', { textContent: modalTitleText }),
    el('button', { type: 'button', classes: ['modal-close-x'], textContent: '✕' })
  ]);

  // Footer Zone
  const footerZone = el('div', { classes: ['modal-footer'] }, [
    el('button', { type: 'button', classes: ['btn-cancel'], textContent: 'Cancel' }),
    el('button', { type: 'submit', form: 'todoForm', classes: ['btn-submit'], textContent: isEditMode ? 'Update Task' : 'Save Task' })
  ]);

  // Combined Modal Card
  const modalCard = el('div', { classes: ['modal-card'] }, [
    headerZone,
    formElement,
    footerZone
  ]);

  // Screen Overlay Back-mask
  overlayElement = el('div', { classes: ['modal-overlay'] }, [modalCard]);

  // 4. Attach Navigation & Exit Function Pathways
  // Strategy A: The event.target check for outer backdrop clicks
  overlayElement.addEventListener('click', (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  });

  // Header X button click hook
  headerZone.querySelector('.modal-close-x').addEventListener('click', closeModal);

  // Footer Cancel button click hook
  footerZone.querySelector('.btn-cancel').addEventListener('click', closeModal);

  // 5. Form Submission Listener (The Zero-Logic Implementation)
  formElement.addEventListener('submit', (event) => {
    event.preventDefault(); // Stop page reload

    // Standard native validation runs automatically via 'required' property
    const formData = new FormData(formElement);
    
    // Package form parameters directly into a clean, flat data object
    const todoDataPayload = {
        title: formData.get('title').trim(),
        description: formData.get('description').trim(),
        dueDate: formData.get('dueDate') || null,
        priority: parseInt(formData.get('priority'), 10),
        notes: formData.get('notes').trim()
    };

    // Read index tracking attribute if present
    const trackedIndexAttr = formElement.getAttribute('data-todo-index');
    const targetIndex = trackedIndexAttr !== null ? parseInt(trackedIndexAttr, 10) : null;

    // Zero-Logic Rule: Dispatch object parameters away immediately without saving anything locally
    if (typeof onSubmit === 'function') {
      onSubmit(todoDataPayload, targetIndex);
    }

    closeModal();
  });

  // Inject completed element directly into the DOM tree body
  document.body.appendChild(overlayElement);
}