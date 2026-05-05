import React, { useState, useEffect } from 'react'
import { api } from '../api'

export default function TodoPage() {
  const [todos, setTodos] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodos()
  }, [])

  async function fetchTodos() {
    try {
      const data = await api.getTodos()
      setTodos(data)
    } catch (err) {
      console.error('获取日程失败:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd() {
    if (!newTitle.trim()) return
    try {
      const todo = await api.createTodo(newTitle.trim())
      setTodos(prev => [todo, ...prev])
      setNewTitle('')
    } catch (err) {
      console.error('创建日程失败:', err)
    }
  }

  async function handleToggle(id, completed) {
    try {
      await api.updateTodo(id, { completed: !completed })
      setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !completed } : t))
    } catch (err) {
      console.error('更新日程失败:', err)
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteTodo(id)
      setTodos(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      console.error('删除日程失败:', err)
    }
  }

  const incomplete = todos.filter(t => !t.completed)
  const completed = todos.filter(t => t.completed)

  return (
    <div className="flex-1 flex flex-col bg-cream-50 overflow-hidden animate-fade-in">
      {/* 顶部 */}
      <div className="px-4 sm:px-8 pt-6 sm:pt-12 pb-4">
        <h1 className="text-xl sm:text-3xl font-serif font-semibold text-ink mb-4">📋 我的日程</h1>

        {/* 添加新日程 */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="添加新日程..."
            className="flex-1 px-4 py-2.5 bg-white border border-cream-200 rounded-xl text-sm text-ink placeholder:text-ink/30 outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity active:scale-95"
          >
            添加
          </button>
        </div>
      </div>

      {/* 日程列表 */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 pb-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <svg className="animate-spin w-6 h-6 text-ink-muted" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          </div>
        ) : (
          <>
            {/* 未完成 */}
            {incomplete.length === 0 && completed.length === 0 ? (
              <p className="text-center text-ink-muted text-sm py-8">还没有日程，快来添加吧 ✨</p>
            ) : (
              <div className="space-y-1 max-w-xl">
                {incomplete.map(todo => (
                  <div
                    key={todo.id}
                    className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-cream-200 hover:border-accent/30 transition-all group"
                  >
                    <button
                      onClick={() => handleToggle(todo.id, todo.completed)}
                      className="w-5 h-5 rounded-full border-2 border-cream-300 flex items-center justify-center shrink-0 hover:border-accent transition-colors"
                    >
                      {todo.completed && (
                        <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      )}
                    </button>
                    <span className="flex-1 text-sm text-ink">{todo.title}</span>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-all p-1"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}

                {/* 已完成 */}
                {completed.length > 0 && (
                  <>
                    <p className="text-xs text-ink-muted pt-4 pb-1 px-1">已完成 · {completed.length}</p>
                    {completed.map(todo => (
                      <div
                        key={todo.id}
                        className="flex items-center gap-3 px-4 py-2.5 bg-white/60 rounded-xl border border-cream-100 group transition-all"
                      >
                        <button
                          onClick={() => handleToggle(todo.id, todo.completed)}
                          className="w-5 h-5 rounded-full border-2 border-accent bg-accent flex items-center justify-center shrink-0"
                        >
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        </button>
                        <span className="flex-1 text-sm text-ink/40 line-through">{todo.title}</span>
                        <button
                          onClick={() => handleDelete(todo.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-all p-1"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}