import { useState, useEffect } from 'react'
import { DragDropContext } from '@hello-pangea/dnd'
import Column from './components/Column'

const initialTasks = {
  todo: [
    { id: '1', title: 'Design the UI', priority: 'medium', dueDate: '' },
    { id: '2', title: 'Set up project', priority: 'low', dueDate: '' },
  ],
  inProgress: [
    { id: '3', title: 'Build column component', priority: 'high', dueDate: '' },
  ],
  done: [
    { id: '4', title: 'Install Vite', priority: 'low', dueDate: '' },
  ],
}

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('kanban-tasks')
    return saved ? JSON.parse(saved) : initialTasks
  })
  const [newTaskTitle, setNewTaskTitle] = useState('')

  useEffect(() => {
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks))
  }, [tasks])

  function handleDragEnd(result) {
    const { source, destination } = result
    if (!destination) return
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return

    const sourceCol = source.droppableId
    const destCol = destination.droppableId
    const sourceTasks = [...tasks[sourceCol]]
    const destTasks = sourceCol === destCol ? sourceTasks : [...tasks[destCol]]
    const [movedTask] = sourceTasks.splice(source.index, 1)
    destTasks.splice(destination.index, 0, movedTask)

    setTasks(prev => ({
      ...prev,
      [sourceCol]: sourceTasks,
      [destCol]: destTasks,
    }))
  }

  function handleAddTask() {
    if (!newTaskTitle.trim()) return
    const newTask = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      priority: 'medium',
      dueDate: '',
    }
    setTasks(prev => ({
      ...prev,
      todo: [...prev.todo, newTask],
    }))
    setNewTaskTitle('')
  }

  function handleDeleteTask(taskId, column) {
    setTasks(prev => ({
      ...prev,
      [column]: prev[column].filter(task => task.id !== taskId),
    }))
  }

  function handleEditTask(taskId, newTitle) {
    setTasks(prev => {
      const updated = {}
      for (const col in prev) {
        updated[col] = prev[col].map(task =>
          task.id === taskId ? { ...task, title: newTitle } : task
        )
      }
      return updated
    })
  }

  function handlePriorityChange(taskId, newPriority) {
    setTasks(prev => {
      const updated = {}
      for (const col in prev) {
        updated[col] = prev[col].map(task =>
          task.id === taskId ? { ...task, priority: newPriority } : task
        )
      }
      return updated
    })
  }

  function handleDueDateChange(taskId, newDate) {
  setTasks(prev => {
    const updated = {}
    for (const col in prev) {
      updated[col] = prev[col].map(task =>
        task.id === taskId ? { ...task, dueDate: newDate } : task
      )
    }
    return updated
  })
}

  return (
    <div style={styles.board}>
      <h1 style={styles.title}>TaskFlow</h1>

      <div style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter a new task..."
          value={newTaskTitle}
          onChange={e => setNewTaskTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddTask()}
        />
        <button style={styles.button} onClick={handleAddTask}>
          Add Task
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={styles.columns}>
          <Column
            title="To Do"
            tasks={tasks.todo}
            column="todo"
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onPriorityChange={handlePriorityChange}
            onDueDateChange={handleDueDateChange}
          />
          <Column
            title="In Progress"
            tasks={tasks.inProgress}
            column="inProgress"
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onPriorityChange={handlePriorityChange}
            onDueDateChange={handleDueDateChange}
          />
          <Column
            title="Done"
            tasks={tasks.done}
            column="done"
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onPriorityChange={handlePriorityChange}
            onDueDateChange={handleDueDateChange}
          />
        </div>
      </DragDropContext>
    </div>
  )
}

const styles = {
  board: {
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
    padding: '2rem',
    fontFamily: 'sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#1a202c',
  },
  form: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '2rem',
  },
  input: {
    padding: '0.6rem 1rem',
    borderRadius: '6px',
    border: '1px solid #cbd5e0',
    fontSize: '0.9rem',
    width: '280px',
    outline: 'none',
  },
  button: {
    padding: '0.6rem 1.2rem',
    backgroundColor: '#4a5568',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  columns: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
}

export default App
