import { parse, formatDistanceToNow, isPast, format, isValid } from 'date-fns'

export class Todo {
    constructor(title, description, dueDate, priority, notes) {
        this.id = crypto.randomUUID()
        this.title = title
        this.description = description
        this.dueDate = this._parseDate(dueDate)
        this.priority = priority
        this.notes = notes
    }

    // Helper to safely convert your 'dd-MM-yyyy' string into a Date object
    _parseDate(dateString) {
        if (!dateString || dateString === 'N/A') return null
        const parsed = parse(dateString, 'yyyy-MM-dd', new Date())
        return isValid(parsed) ? parsed : null
    }

    // 1. Get a beautifully formatted display date (e.g., "Jan 1st, 2027")
    get formattedDueDate() {
        if (!this.dueDate) return 'No due date'
        return format(this.dueDate, 'PPP')
    }

    // 2. Check if the task is past its due date
    get isOverdue() {
        if (!this.dueDate) return false
        // isPast checks if the date is earlier than the current instant
        return isPast(this.dueDate)
    }

    // 3. Get the relative time remaining or time elapsed since overdue
    get timeStatus() {
        if (!this.dueDate) return 'No deadline'

        // formatDistanceToNow returns relative strings like "in 3 months" or "3 days ago"
        const relativeTime = formatDistanceToNow(this.dueDate, { addSuffix: true })

        if (this.isOverdue) {
            return `Overdue! (Was due ${relativeTime})`
        }
        return `Due ${relativeTime}`
    }

    get rawDueDateTimestamp() {
        return this.dueDate ? this.dueDate.getTime() : Infinity
    }
}