// stateManager.js
import { project } from './project.js';

// Private Global Memory Cache
let projects = [];
let activeProjectIndex = 0;

export const StateManager = {
  // Allows the system initialization cycle to load parsed objects
  setInitialState(loadedProjects) {
    projects = loadedProjects;
    activeProjectIndex = 0; // Default view allocation
  },

  // Establishes a standard baseline project workspace configuration
  initializeDefaultWorkspace() {
    projects = [project("Project 0")];
    activeProjectIndex = 0;
  },

  getRawProjectsArray() {
    return projects; // Exposed cleanly to the local storage interface
  },

  getProjects() {
    return [...projects];
  },

  addProject(name) {
    const newProject = project(name);
    projects.push(newProject);
    return newProject;
  },

  deleteProject(index) {
    if (index === 0) return; 
    projects.splice(index, 1);
    if (activeProjectIndex === index) {
      activeProjectIndex = 0; 
    } else if (activeProjectIndex > index) {
      activeProjectIndex--; 
    }
  },

  getActiveProject() {
    return projects[activeProjectIndex];
  },

  setActiveProject(index) {
    if (index >= 0 && index < projects.length) {
      activeProjectIndex = index;
    }
  }
};