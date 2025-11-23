import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState('all') // all, active, completed

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      }])
      setInputValue('')
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const activeCount = todos.filter(todo => !todo.completed).length

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>My Tasks</h1>
          <p className="subtitle">Stay organized and productive</p>
        </header>

        <form onSubmit={addTodo} className="todo-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What needs to be done?"
            className="todo-input"
          />
          <button type="submit" className="add-button">Add Task</button>
        </form>

        <div className="filter-buttons">
          <button
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'active' : ''}
          >
            All ({todos.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={filter === 'active' ? 'active' : ''}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={filter === 'completed' ? 'active' : ''}
          >
            Completed ({todos.length - activeCount})
          </button>
        </div>

        <div className="todo-list">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <p>No tasks {filter !== 'all' ? `(${filter})` : ''}</p>
              <p className="empty-hint">Add a task above to get started!</p>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="todo-checkbox"
                />
                <span className="todo-text">{todo.text}</span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-button"
                  aria-label="Delete task"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {todos.length > 0 && (
          <div className="footer">
            <span className="todo-count">
              {activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining
            </span>
            {todos.length - activeCount > 0 && (
              <button onClick={clearCompleted} className="clear-button">
                Clear completed
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App

