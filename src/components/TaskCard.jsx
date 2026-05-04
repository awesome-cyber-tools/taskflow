import { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'

const PRIORITIES = {
  low:    { label: 'Low',    color: '#38a169', bg: '#f0fff4' },
  medium: { label: 'Medium', color: '#d69e2e', bg: '#fffff0' },
  high:   { label: 'High',   color: '#e53e3e', bg: '#fff5f5' },
}

// Check if a due date is overdue
function isOverdue(dueDate) {
  if (!dueDate) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0) // strip time, compare dates only
  return new Date(dueDate) < today
}

// Format date nicely: "May 10" instead of "2026-05-10"
function formatDate(dueDate) {
  if (!dueDate) return null
  const date = new Date(dueDate + 'T00:00:00') // force local time
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function TaskCard({ task, index, onDelete, onEdit, onPriorityChange, onDueDateChange }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(task.title)
  const [showDatePicker, setShowDatePicker] = useState(false)

  function handleSave() {
    if (!editValue.trim()) return
    onEdit(task.id, editValue.trim())
    setIsEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') {
      setEditValue(task.title)
      setIsEditing(false)
    }
  }

  function cyclePriority() {
    const order = ['low', 'medium', 'high']
    const next = order[(order.indexOf(task.priority) + 1) % order.length]
    onPriorityChange(task.id, next)
  }

  const priority = PRIORITIES[task.priority] || PRIORITIES.medium
  const overdue = isOverdue(task.dueDate)

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...styles.card,
            borderLeft: overdue ? '3px solid #e53e3e' : '3px solid transparent',
            boxShadow: snapshot.isDragging
              ? '0 8px 16px rgba(0,0,0,0.15)'
              : '0 1px 3px rgba(0,0,0,0.1)',
            transform: snapshot.isDragging ? 'rotate(2deg)' : 'rotate(0deg)',
            ...provided.draggableProps.style,
          }}
        >
          <div style={styles.cardBody}>

            {/* Task title — click to edit */}
            {isEditing ? (
              <input
                autoFocus
                style={styles.input}
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
              />
            ) : (
              <p
                style={styles.title}
                onClick={() => setIsEditing(true)}
                title="Click to edit"
              >
                {task.title}
              </p>
            )}

            {/* Footer: priority badge + due date */}
            <div style={styles.footer}>
              <span
                style={{
                  ...styles.badge,
                  color: priority.color,
                  backgroundColor: priority.bg,
                }}
                onClick={cyclePriority}
                title="Click to change priority"
              >
                {priority.label}
              </span>

              {/* Due date display or picker */}
              {showDatePicker ? (
                <input
                  type="date"
                  autoFocus
                  style={styles.dateInput}
                  value={task.dueDate}
                  onChange={e => {
                    onDueDateChange(task.id, e.target.value)
                    setShowDatePicker(false)
                  }}
                  onBlur={() => setShowDatePicker(false)}
                />
              ) : (
                <span
                  style={{
                    ...styles.dateLabel,
                    color: overdue ? '#e53e3e' : '#718096',
                    fontWeight: overdue ? '600' : '400',
                  }}
                  onClick={() => setShowDatePicker(true)}
                  title="Click to set due date"
                >
                  {task.dueDate ? formatDate(task.dueDate) : '+ date'}
                </span>
              )}
            </div>

          </div>

          <button style={styles.deleteBtn} onClick={onDelete}>✕</button>
        </div>
      )}
    </Draggable>
  )
}

const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    padding: '0.75rem 1rem',
    cursor: 'grab',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    transition: 'box-shadow 0.2s ease',
  },
  cardBody: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  title: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#2d3748',
    cursor: 'text',
    wordBreak: 'break-word',
  },
  input: {
    fontSize: '0.9rem',
    color: '#2d3748',
    border: 'none',
    outline: '2px solid #667eea',
    borderRadius: '4px',
    padding: '4px 6px',
    width: '100%',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  badge: {
    fontSize: '0.7rem',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '999px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  dateLabel: {
    fontSize: '0.75rem',
    cursor: 'pointer',
    userSelect: 'none',
  },
  dateInput: {
    fontSize: '0.75rem',
    border: '1px solid #cbd5e0',
    borderRadius: '4px',
    padding: '2px 4px',
    outline: 'none',
    color: '#2d3748',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#a0aec0',
    cursor: 'pointer',
    fontSize: '0.8rem',
    padding: '2px 4px',
    flexShrink: 0,
    marginLeft: '6px',
  },
}

export default TaskCard
