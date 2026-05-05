import React, { useState } from 'react';
import Settings from './Settings';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ notes, activeId, onSelect, onCreate, onDelete, loading, onClose, activeTab, onTabChange }) {
  const auth = useAuth();
  const { user, logout } = auth || { user: { username: '访客' }, logout: () => {} };
  const [contextMenu, setContextMenu] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  function handleContextMenu(e, noteId) {
    e.preventDefault();
    setContextMenu({ noteId, x: e.clientX, y: e.clientY });
  }

  function handleDeleteClick(noteId) {
    setContextMenu(null);
    setDeleteConfirm(noteId);
  }

  function handleDeleteConfirm() {
    onDelete(deleteConfirm);
    setDeleteConfirm(null);
  }

  return (
    <>
      <aside className="w-72 h-full bg-sidebar-bg flex flex-col border-r border-sidebar-border select-none shadow-2xl">
{/* 顶部：Tab 切换 */}
<div className="flex items-center justify-between px-3 pt-4 pb-2">
  <div className="flex bg-sidebar-hover rounded-lg p-0.5">
    <button
      onClick={() => onTabChange?.('diary')}
      className={`px-3 py-1 text-xs rounded-md transition-all ${
        activeTab === 'diary'
          ? 'bg-accent text-white'
          : 'text-sidebar-text hover:text-white'
      }`}
    >
      📔 日记
    </button>
    <button
      onClick={() => onTabChange?.('todo')}
      className={`px-3 py-1 text-xs rounded-md transition-all ${
        activeTab === 'todo'
          ? 'bg-accent text-white'
          : 'text-sidebar-text hover:text-white'
      }`}
    >
      📋 日程
    </button>
  </div>
  <button
    onClick={onClose}
    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-sidebar-hover text-sidebar-text transition-colors"
  >
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
</div>

        {/* 用户信息 + 新建按钮 */}
        <div className="px-3 pb-2">
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-sidebar-hover transition-colors group">
            <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center text-white text-xs font-semibold shrink-0">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sidebar-text-active text-sm font-medium truncate">{user?.username}</p>
              <p className="text-sidebar-text text-xs">的日记空间</p>
            </div>
            <button
              onClick={onCreate}
              className="p-1.5 ml-auto text-sidebar-text hover:bg-sidebar-hover hover:text-white rounded-md transition-colors"
              title="新建日记"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        {/* 分隔线 */}
        <div className="h-px bg-sidebar-border mx-3 mb-2" />

        {/* 日记列表 */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {notes.length === 0 ? (
            <p className="text-sidebar-text text-xs text-center py-8">还没有日记，点击 + 新建</p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                onClick={() => onSelect(note.id)}
                onContextMenu={(e) => handleContextMenu(e, note.id)}
                className={`group flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  activeId === note.id
                    ? 'bg-accent text-white'
                    : 'text-sidebar-text hover:bg-sidebar-hover/50'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{note.title || '无标题'}</p>
                  <p className="text-[10px] opacity-50 truncate">
                    {note.updated_at ? new Date(note.updated_at).toLocaleDateString('zh-CN') : ''}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 底部：退出登录 + 设置 */}
        <div className="px-3 pb-4 pt-3 mt-auto border-t border-sidebar-border">
          <div className="flex items-center justify-between">
            <button
              onClick={logout}
              className="flex items-center gap-2 px-2 py-2 text-sidebar-text hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-150 text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              退出
            </button>
            <Settings />
          </div>
        </div>
      </aside>

      {/* 右键菜单 */}
      {contextMenu && (
        <>
          <div className="fixed inset-0 z-50" onClick={() => setContextMenu(null)} />
          <div
            className="fixed z-50 bg-white rounded-xl shadow-xl border border-cream-200 py-1.5 min-w-36 animate-fade-in"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-color"
              onClick={() => {
                onDelete(contextMenu.noteId);
                setContextMenu(null);
              }}
            >
              删除日记
            </button>
          </div>
        </>
      )}
    </>
  );
}