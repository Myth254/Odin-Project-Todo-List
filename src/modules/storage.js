// storage.js
import { project } from './project.js';
import { createTodo } from './todo.js';

const STORAGE_KEY = 'todoAppState';

export const StorageManager = {
  /**
   * Converts live memory structures into plain JSON text strings.
   * Method signatures are discarded automatically by stringify.
   */
  save(projectsArray) {
    // 1. Map the live array to a clean data layout for serialization
    const serializedData = projectsArray.map(proj => {
      return {
        name: proj.name,
        // Map over the underlying array of todos extracted via readTodos()
        todos: proj.readTodos().map(todo => ({
          title: todo.title,
          description: todo.description,
          dueDate: todo.dueDate,
          priority: todo.priority,
          notes: todo.notes,
          isComplete: todo.get() // Explicitly save the private state value
        }))
      };
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedData));
  },

  /**
   * Extracts raw JSON strings and rehydrates them back into functional objects.
   * Returns null if no storage exists or if data corruption is intercepted.
   */
  load() {
    try {
      const rawString = localStorage.getItem(STORAGE_KEY);
      
      // Null Check: App is opening for the very first time
      if (!rawString) return null;

      const parsedProjects = JSON.parse(rawString);
      const rehydratedProjects = [];

      // Rehydration Loop Pattern
      parsedProjects.forEach(rawProj => {
        // Reconstruct Live Project Node Container
        const liveProject = project(rawProj.name);

        // Reconstruct Live Todo Nodes
        if (Array.isArray(rawProj.todos)) {
          rawProj.todos.forEach(rawTodo => {
            const liveTodo = createTodo({
              title: rawTodo.title,
              description: rawTodo.description,
              dueDate: rawTodo.dueDate,
              priority: rawTodo.priority,
              notes: rawTodo.notes
            });

            // Restore completion state using closure toggle if saved as true
            if (rawTodo.isComplete) {
              liveTodo.toggleComplete();
            }

            // Link them back up inside the newly spawned container instance
            liveProject.addTodo(liveTodo);
          });
        }

        rehydratedProjects.push(liveProject);
      });

      return rehydratedProjects;

    } catch (error) {
      // Defensive Rescue Mechanism: Wipe bad schemas to prevent application crashes
      console.error("Corrupted or outdated data detected. Resetting storage...", error);
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }
};
