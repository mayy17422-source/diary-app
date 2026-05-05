import React from 'react'

const icons = {
  bold: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 4h8a4 4 0 010 8H6z"/>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h9a4 4 0 010 8H6z"/>
    </svg>
  ),
  italic: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/>
      <line x1="15" y1="4" x2="9" y2="20"/>
    </svg>
  ),
  underline: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v7a5 5 0 0010 0V4M5 20h14"/>
    </svg>
  ),
  h1: <span className="text-xs font-bold">H1</span>,
  h2: <span className="text-xs font-bold">H2</span>,
  h3: <span className="text-xs font-bold">H3</span>,
  bulletList: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/>
      <circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/>
    </svg>
  ),
  orderedList: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h1V4M4 12h2M4 16v1a1 1 0 001 1h1"/>
    </svg>
  ),
  blockquote: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h4m-4 4h4m5-8v12M5 4a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2H5z"/>
    </svg>
  ),
  code: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  undo: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6M3 10l6-6" />
    </svg>
  ),
  redo: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6M21 10l-6-6" />
    </svg>
  ),
}

export default function Toolbar({ editor, vertical = false }) {
  if (!editor) return null

  const buttons = [
    { key: 'bold', label: '加粗', action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
    { key: 'italic', label: '斜体', action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
    { key: 'underline', label: '下划线', action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline') },
    { key: 'h1', label: '标题1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
    { key: 'h2', label: '标题2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
    { key: 'h3', label: '标题3', action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }) },
    { key: 'bulletList', label: '无序列表', action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
    { key: 'orderedList', label: '有序列表', action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList') },
    { key: 'blockquote', label: '引用', action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote') },
    { key: 'code', label: '代码', action: () => editor.chain().focus().toggleCode().run(), active: editor.isActive('code') },
  ]

  const historyButtons = [
    { key: 'undo', label: '撤销', action: () => editor.chain().focus().undo().run(), active: false },
    { key: 'redo', label: '重做', action: () => editor.chain().focus().redo().run(), active: false },
  ]

  return (
    <div className={`flex ${vertical ? 'flex-col' : 'flex-row items-center'} gap-0.5`}>
      {/* 格式按钮 */}
      {buttons.map(({ key, label, action, active }) => (
        <button
          key={key}
          title={label}
          onMouseDown={(e) => { e.preventDefault(); action() }}
          className={`toolbar-btn ${active ? 'active' : ''}`}
        >
          {icons[key]}
        </button>
      ))}

      {/* 分隔线 */}
      <div className={vertical ? 'w-5 h-px bg-cream-200 my-1' : 'w-px h-5 bg-cream-200 mx-1'} />

      {/* 撤销/重做 */}
      {historyButtons.map(({ key, label, action, active }) => (
        <button
          key={key}
          title={label}
          onMouseDown={(e) => { e.preventDefault(); action() }}
          className={`toolbar-btn ${active ? 'active' : ''}`}
        >
          {icons[key]}
        </button>
      ))}
    </div>
  )
}