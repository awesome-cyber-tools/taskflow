import { Droppable } from '@hello-pangea/dnd'
import TaskCard from './TaskCard'

function Column({ title, tasks, column, onDeleteTask, onEditTask, onPriorityChange, onDueDateChange }) {
  return (
    <div style={styles.column}>
      <h2 style={styles.heading}>
        {title}
        <span style={styles.count}>{tasks.length}</span>
      </h2>
      <Droppable droppableId={column}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              ...styles.cardList,
              backgroundColor: snapshot.isDraggingOver ? '#cbd5e0' : 'transparent',
              transition: 'background-color 0.2s ease',
              borderRadius: '6px',
              minHeight: '200px',
              padding: '4px',
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
    backgroundColor: '#e2e8f0',
    borderRadius: '8px',
    padding: '1rem',
    width: '280px',
    minHeight: '400px',
  },
  heading: {
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#2d3748',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  count: {
    backgroundColor: '#cbd5e0',
    borderRadius: '999px',
    padding: '2px 8px',
    fontSize: '0.75rem',
  },
  cardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
}

export default Column
