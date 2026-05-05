import { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'

const PRIORITIES = {
  low:    { label: 'Low',    color: '#43e97b', bg: 'rgba(67, 233, 123, 0.1)' },
  medium: { label: 'Medium', color: '#f9ca24', bg: 'rgba(249, 202, 36, 0.1)' },
  high:   { label: 'High',   color: '#ff6b6b', bg: 'rgba(255, 107, 107, 0.1)' },
}

function isOverdue(dueDate) {
  if (!dueDate) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(dueDate) < today
}

function formatDate(dueDate) {
  if (!dueDate) return null
  const date = new Date(dueDate + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function TaskCard({ task, index, onDelete, onEdit, onPriorityChange, onDueDateChange }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(task.title)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [hovered, setHovered] = useState(false)

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
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            ...styles.card,
            borderColor: overdue
              ? 'rgba(255,107,107,0.4)'
              : hovered
              ? '#3a3f55'
              : '#2d3148',
            boxShadow: snapshot.isDragging
              ? '0 16px 40px rgba(0,0,0,0.5)'
              : hovered
              ? '0 4px 20px rgba(102,126,234,0.15)'
              : '0 2px 8px rgba(0,0,0,0.2)',
            transform: snapshot.isDragging ? 'rotate(2deg) scale(1.02)' : 'rotate(0deg) scale(1)',
            transition: snapshot.isDragging ? 'none' : 'all 0.2s ease',
            ...provided.draggableProps.style,
          }}
        >
          <div style={styles.cardBody}>
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
                ● {priority.label}
              </span>

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
                    color: overdue ? '#ff6b6b' : '#4a5568',
                    fontWeight: overdue ? '600' : '400',
                  }}
                  onClick={() => setShowDatePicker(true)}
                  title="Click to set due date"
                >
                  {task.dueDate ? (overdue ? '⚠ ' : '📅 ') + formatDate(task.dueDate) : '+ date'}
                </span>
              )}
            </div>
          </div>

          <button
            style={{
              ...styles.deleteBtn,
              opacity: hovered ? 1 : 0,
            }}
            onClick={onDelete}
          >
            ✕
          </button>
        </div>
      )}
    </Draggable>
  )
}

const styles = {
  card: {
    backgroundColor: '#1e2130',
    borderRadius: '12px',
    padding: '1rem',
    cursor: 'grab',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    border: '1px solid #2d3148',
  },
  cardBody: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  title: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#e2e8f0',
    cursor: 'text',
    wordBreak: 'break-word',
    lineHeight: '1.4',
  },
  input: {
    fontSize: '0.9rem',
    color: '#e2e8f0',
    border: 'none',
    outline: '2px solid #667eea',
    borderRadius: '6px',
    padding: '4px 6px',
    width: '100%',
    backgroundColor: '#2d3148',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  badge: {
    fontSize: '0.7rem',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '999px',
    cursor: 'pointer',
    userSelect: 'none',
    letterSpacing: '0.02em',
  },
  dateLabel: {
    fontSize: '0.75rem',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'color 0.2s ease',
  },
  dateInput: {
    fontSize: '0.75rem',
    border: '1px solid #3a3f55',
    borderRadius: '6px',
    padding: '2px 6px',
    outline: 'none',
    color: '#e2e8f0',
    backgroundColor: '#2d3148',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#ff6b6b',
    cursor: 'pointer',
    fontSize: '0.8rem',
    padding: '2px 4px',
    flexShrink: 0,
    marginLeft: '6px',
    transition: 'opacity 0.2s ease',
  },
}

export default TaskCard
