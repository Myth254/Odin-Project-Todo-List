// projectsPanel.js
import { StateManager } from '../modules/appState.js';
import { el } from './domHelpers.js';
import { renderApp } from '../index.js';

/**
 * Renders the sidebar project list layout
 */
export function renderProjectsPanel() {
  const projectListDiv = document.querySelector('#projectList');
  if (!projectListDiv) return;
  
  projectListDiv.innerHTML = ''; // Clear old layout structure

  const projects = StateManager.getProjects();
  const activeProject = StateManager.getActiveProject();

  projects.forEach((proj, index) => {
    const isActive = (proj === activeProject);
    
    const projectItem = el(
      'div', 
      { 
        classes: ['project-item', isActive ? 'active' : ''],
        // Attach identity index straight to the row element container
        'data-project-index': index 
      }, 
      [
        el('span', { classes: ['project-name-text'], textContent: proj.name }),
        // Suppress delete UI on the baseline Inbox folder (index 0)
        index > 0 
          ? el('button', { classes: ['delete-project-btn'], textContent: '✕' }) 
          : el('span')
      ]
    );

    projectListDiv.appendChild(projectItem);
  });
}

/**
 * Binds a single event listener to the parent container (Event Delegation)
 */
export function initProjectsEvents() {
  const projectListDiv = document.querySelector('#projectList');
  const createProjectBtn = document.querySelector('#createProjectBtn');

  if (projectListDiv) {
    projectListDiv.addEventListener('click', (event) => {
      // Find the closest parent project row to read its mapped array identity
      const projectRow = event.target.closest('.project-item');
      if (!projectRow) return;

      const projectIndex = parseInt(projectRow.getAttribute('data-project-index'), 10);

      // Branch behavior based on target class signatures
      if (event.target.classList.contains('delete-project-btn')) {
        StateManager.deleteProject(projectIndex);
        renderApp(); // Refresh everything
      } else {
        StateManager.setActiveProject(projectIndex);
        renderApp(); // Master redraw updates view context seamlessly
      }
    });
  }

  if (createProjectBtn) {
    createProjectBtn.addEventListener('click', () => {
      const name = prompt("Enter new project name:");
      if (name && name.trim() !== "") {
        StateManager.addProject(name.trim());
        renderApp();
      }
    });
  }
}
