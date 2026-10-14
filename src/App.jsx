import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'simple-task-manager-tasks';

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [taskText, setTaskText] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  function addTask(event) {
    event.preventDefault();
    const title = taskText.trim();
    if (!title) return;
    setTasks(current => [
      { id: `${Date.now()}-${Math.random()}`, title, completed: false, createdAt: new Date().toISOString() },
      ...current,
    ]);
    setTaskText('');
  }

  function toggleTask(id) {
    setTasks(current => current.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  }

  function deleteTask(id) {
    setTasks(current => current.filter(task => task.id !== id));
  }

  const visibleTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });
  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <main className="page">
      <section className="app-card">
        <header className="header">
          <div className="app-icon" aria-hidden="true">✓</div>
          <p className="eyebrow">YOUR DAY, ORGANIZED</p>
          <h1>Task Manager</h1>
          <p className="subtitle">Keep things simple. One task at a time.</p>
        </header>

        <form className="add-form" onSubmit={addTask}>
          <input
            aria-label="New task"
            value={taskText}
            onChange={event => setTaskText(event.target.value)}
            placeholder="What do you need to do?"
            maxLength={160}
          />
          <button type="submit" disabled={!taskText.trim()}>Add task</button>
        </form>

        <div className="summary">
          <span>{tasks.length - completedCount} left to do</span>
          <span>{completedCount} completed</span>
        </div>

        <nav className="filters" aria-label="Filter tasks">
          {['all', 'active', 'completed'].map(option => (
            <button
              type="button"
              key={option}
              className={filter === option ? 'filter active-filter' : 'filter'}
              onClick={() => setFilter(option)}
            >
              {option[0].toUpperCase() + option.slice(1)}
            </button>
          ))}
        </nav>

        {visibleTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">☀</div>
            <h2>{filter === 'completed' ? 'Nothing completed yet' : filter === 'active' ? 'You are all caught up' : 'Nothing on your list yet'}</h2>
            <p>{filter === 'all' ? 'Add your first task above to get started.' : 'Try another filter or add a new task.'}</p>
          </div>
        ) : (
          <ul className="task-list">
            {visibleTasks.map(task => (
              <li className={task.completed ? 'task completed-task' : 'task'} key={task.id}>
                <label className="task-label">
                  <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} />
                  <span className="custom-check" aria-hidden="true">✓</span>
                  <span className="task-title">{task.title}</span>
                </label>
                <button className="delete-button" type="button" onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.title}`} title="Delete task">×</button>
              </li>
            ))}
          </ul>
        )}

        {completedCount > 0 && (
          <button className="clear-button" type="button" onClick={() => setTasks(current => current.filter(task => !task.completed))}>
            Clear completed tasks
          </button>
        )}
        <footer>Tasks are saved automatically in this browser.</footer>
      </section>
    </main>
  );
}
