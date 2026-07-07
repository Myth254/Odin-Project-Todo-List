export function createTodo({
    title, 
    description = "", 
    dueDate = null,
    priority = 2,
    notes = ""
}) {
    let isComplete = false // private variable

    return {
        title,
        description,
        dueDate,
        priority,
        notes,

        get() {
            return isComplete
        },

        toggleComplete() {
            isComplete = !isComplete
            return isComplete
        }
    }
}