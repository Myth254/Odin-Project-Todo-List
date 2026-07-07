import './styles.css'
// index.js
import { StateManager } from './modules/appState.js';
import { StorageManager } from './modules/storage.js';
import { renderProjectsPanel, initProjectsEvents } from './ui/projectsPanel.js';
import { renderTodosPanel, initTodosEvents } from './ui/todosPanel.js';

/**
 * Master Redraw Function
 * Synchronizes the visual DOM layer and persists variables directly to localStorage.
 */
export function renderApp() {
  renderProjectsPanel();
  renderTodosPanel();
  
  // Automated Persistence Tracking Layer
  StorageManager.save(StateManager.getRawProjectsArray());
}

// 4. Startup Initialization & Defensive Verification Cycle
document.addEventListener('DOMContentLoaded', () => {
  // Look for your specific key in localStorage and rehydrate
  const loadedData = StorageManager.load();

  if (loadedData && loadedData.length > 0) {
    // If objects are successfully revived, pass active data to memory structure
    StateManager.setInitialState(loadedData);
  } else {
    // Fallback rescue routine if null or caught error occurred
    StateManager.initializeDefaultWorkspace();
  }

  // Bind static structural event listeners
  initProjectsEvents();
  initTodosEvents();
  
  // Render workspace layout view for the user
  renderApp();
});
