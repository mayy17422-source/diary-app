import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import { api } from '../api'
import Toolbar from './Toolbar'

function useDebouncedCallback(fn, delay) {
  const timer = useRef(null)
  return useCallback((...args) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => fn(...args), delay)
  }, [fn, delay])
}

const SAVE_STATUS = {
  idle: '',
  saving: '保存中...',
  saved: '已保存',
  error: '保存失败',
}

export default function Editor({ noteId, onUpdate, onNoteChange }) {
  const [title, setTitle] = useState('')
  const [saveStatus, setSaveStatus] = useState('idle')
  const [loading, setLoading] = useState(false)
  const currentNoteId = useRef(null)
  const savedTimer = useRef(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: '开始书写今天的故事……',
      }),
    ],
    editorProps: {
      attributes: { class: 'tiptap-editor' },
    },
    onUpdate: ({ editor }) => {
      if (currentNoteId.current) {
        debouncedSave(title, editor.getHTML())
      }
    },
  })

  async function save(t, content) {
    if (!currentNoteId.current) return
    setSaveStatus('saving')
    try {
      const updated = await api.updateNote(currentNoteId.current, t, content)
      setSaveStatus('saved')
      onUpdate(updated)
      clearTimeout(savedTimer.current)
      savedTimer.current = setTimeout(() => setSaveStatus('idle'), 2000)
    } catch {
      setSaveStatus('error')
    }
  }

  const debouncedSave = useDebouncedCallback(save, 1000)

  async function handleTitleChange(e) {
    const val = e.target.value
    setTitle(val)
    if (currentNoteId.current && editor) {
      debouncedSave(val, editor.getHTML())
    }
  }

  useEffect(() => {
    if (!noteId) {
      currentNoteId.current = null
      setTitle('')
      editor?.commands.setContent('')
      setSaveStatus('idle')
      return
    }

    currentNoteId.current = null
    setLoading(true)
    setSaveStatus('idle')

    api.getNote(noteId).then((note) => {
      currentNoteId.current = note.id
      setTitle(note.title || '')
      editor?.commands.setContent(note.content || '')
      setLoading(false)
      onNoteChange?.(note)
    }).catch(() => {
      setLoading(false)
    })
  }, [noteId, editor])

  if (!noteId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-cream-50 text-ink-muted animate-fade-in px-4">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-cream-200 flex items-center justify-center mb-4 sm:mb-6">
          <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" viewBox="0 0 24 24" stroke="#c4bdb6" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <p className="text-base sm:text-lg font-serif font-medium text-ink/40 text-center">选择或创建一篇日记</p>
        <p className="text-xs sm:text-sm text-ink-muted/60 mt-2 text-center">点击左上角按钮打开日记列表</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-cream-50 overflow-hidden animate-fade-in">
      {/* 顶部状态栏：只保留保存状态 */}
      <div className="flex items-center justify-end px-3 sm:px-4 py-1 sm:py-1.5 bg-white/60 backdrop-blur-sm border-b border-cream-200">
        <span className={`text-[10px] sm:text-xs transition-all duration-300 ${
          saveStatus === 'saving' ? 'text-ink-muted' :
          saveStatus === 'saved' ? 'text-green-500' :
          saveStatus === 'error' ? 'text-red-500' : 'text-transparent'
        }`}>
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1">
              <svg className="animate-spin w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              保存中...
            </span>
          )}
          {saveStatus === 'saved' && '✓ 已保存'}
          {saveStatus === 'error' && '✗ 保存失败'}
        </span>
      </div>

      {/* 主体：编辑器 + 右侧工具栏 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 编辑区域 */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <svg className="animate-spin w-5 h-5 sm:w-6 sm:h-6 text-ink-muted" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 sm:px-8 pt-6 sm:pt-12 pb-8 sm:pb-12">
              {/* Title */}
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="无标题"
                className="w-full bg-transparent text-xl sm:text-4xl font-serif font-semibold text-ink placeholder:text-ink/20 outline-none mb-5 sm:mb-8 leading-tight resize-none"
              />
              {/* Editor */}
              <EditorContent editor={editor} />
            </div>
          )}
        </div>

        {/* 右侧竖排工具栏 */}
        <div className="w-10 sm:w-12 border-l border-cream-200 bg-white/40 flex flex-col items-center py-3 sm:py-4 gap-0.5 sm:gap-1 overflow-y-auto">
          <Toolbar editor={editor} vertical />
        </div>
      </div>
    </div>
  )
}