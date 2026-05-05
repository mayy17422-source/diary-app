import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Editor from '../components/Editor'
import TodoPage from './TodoPage'
import { api } from '../api'

export default function DiaryPage() {
  const [notes, setNotes] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('diary') // ✅ 新增

  useEffect(() => {
    fetchNotes()
  }, [])

  async function fetchNotes() {
    try {
      const data = await api.getNotes()
      setNotes(data)
      if (data.length > 0 && !activeId) {
        setActiveId(data[0].id)
      }
    } catch (err) {
      console.error('Failed to fetch notes:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate() {
    try {
      const note = await api.createNote('', '')
      setNotes((prev) => [note, ...prev])
      setActiveId(note.id)
      setSidebarOpen(false)
    } catch (err) {
      console.error('Failed to create note:', err)
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteNote(id)
      setNotes((prev) => prev.filter((n) => n.id !== id))
      if (activeId === id) {
        const remaining = notes.filter((n) => n.id !== id)
        setActiveId(remaining.length > 0 ? remaining[0].id : null)
      }
    } catch (err) {
      console.error('Failed to delete note:', err)
    }
  }

  function handleSelect(id) {
    setActiveId(id)
    setSidebarOpen(false)
  }

  function handleNoteUpdate(updated) {
    setNotes((prev) =>
      prev.map((n) => n.id === updated.id
        ? { ...n, title: updated.title, updated_at: updated.updated_at }
        : n
      ).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    )
  }

  return (
    <div className="h-screen flex overflow-hidden bg-sidebar-bg relative">
      {/* 浮动汉堡按钮 */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center bg-sidebar-bg hover:bg-sidebar-hover rounded-xl shadow-lg border border-sidebar-border text-sidebar-text transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* 遮罩层 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏浮层 */}
      <div
        className={`fixed top-0 left-0 z-40 h-full transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          notes={notes}
          activeId={activeId}
          onSelect={handleSelect}
          onCreate={handleCreate}
          onDelete={handleDelete}
          loading={loading}
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* ✅ 编辑区域 — 根据 Tab 切换 */}
      <div className="flex-1 flex overflow-hidden w-full">
        {activeTab === 'diary' ? (
          <Editor
            noteId={activeId}
            onUpdate={handleNoteUpdate}
            onNoteChange={() => {}}
          />
        ) : (
          <TodoPage />
        )}
      </div>
    </div>
  )
}