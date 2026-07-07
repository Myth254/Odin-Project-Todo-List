// domHelpers.js
/**
 * Creates a DOM element with classes, attributes, text content, and nested children.
 * @param {string} tagName - The type of element to create (e.g., 'div', 'button').
 * @param {Object} [options={}] - Configuration for classes, attributes, and text.
 * @param {string[]} [options.classes=[]] - Array of class names to apply.
 * @param {string} [options.textContent] - Text content for the element.
 * @param {HTMLElement[]} [children=[]] - Array of DOM elements to nest inside.
 * @returns {HTMLElement} The constructed DOM element.
 */

export function el(tagName, options = {}, children = []) {
    // 1. Create Element
    const element = document.createElement(tagName);

    // 2. Extract known properties, rest are attributes
    const { classes = [], textContent, ...attributes } = options;

    // Apply classes
    classes.forEach(className => {
        if (className) element.classList.add(className);
    });

    // Apply text content
    if (textContent !== undefined) {
        element.textContent = textContent;
    }

    // Apply HTML attributes (e.g., id, type, data-*, placeholder)
    Object.entries(attributes).forEach(([key, val]) => {
        if (val !== undefined) {
            element.setAttribute(key, val);
        }
    });

    // Nest children
    children.forEach(child => {
        if (child instanceof HTMLElement) {
            element.appendChild(child);
        }
    });

    return element;
}