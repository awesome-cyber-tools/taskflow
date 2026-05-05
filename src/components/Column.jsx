import { Droppable } from '@hello-pangea/dnd'
import TaskCard from './TaskCard'

const COLUMN_COLORS = {
  todo:       { accent: '#667eea', label: '#667eea' },
  inProgress: { accent: '#f093fb', label: '#f093fb' },
  done:       { accent: '#43e97b', label: '#43e97b' },
}

function Column({ title, tasks, column, onDeleteTask, onEditTask, onPriorityChange, onDueDateChange }) {
  const color = COLUMN_COLORS[column] || COLUMN_COLORS.todo

  return (
    <div style={styles.column}>
      {/* Column header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ ...styles.accent, backgroundColor: color.accent }} />
          <h2 style={{ ...styles.heading, color: color.label }}>{title}</h2>
        </div>
        <span style={styles.count}>{tasks.length}</span>
      </div>

      <Droppable droppableId={column}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              ...styles.cardList,
              backgroundColor: snapshot.isDraggingOver
                ? 'rgba(102, 126, 234, 0.05)'
                : 'transparent',
              borderColor: snapshot.isDraggingOver
                ? 'rgba(102, 126, 234, 0.3)'
                : 'transparent',
              transition: 'all 0.2s ease',
            }}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onDelete={() => onDeleteTask(task.id, column)}
                onEdit={onEditTask}
                onPriorityChange={onPriorityChange}
                onDueDateChange={onDueDateChange}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}

const styles = {
  column: {
    background: 'linear-gradient(180deg, #1a1d27 0%, #161820 100%)',
    borderRadius: '16px',
    padding: '1.25rem',
    width: '300px',
    minHeight: '500px',
    border: '1px solid #2d3148',
    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #2d3148',
  },
  accent: {
    width: '4px',
    height: '18px',
    borderRadius: '999px',
  },
  heading: {
    fontSize: '0.95rem',
    fontWeight: '600',
    letterSpacing: '0.02em',
  },
  count: {
    backgroundColor: '#2d3148',
    color: '#8892b0',
    borderRadius: '999px',
    padding: '2px 10px',
    fontSize: '0.75rem',
    fontWeight: '500',
  },
  cardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    minHeight: '200px',
    borderRadius: '10px',
    border: '1px dashed transparent',
    padding: '4px',
  },
}

export default Column
