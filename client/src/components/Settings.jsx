// src/components/Settings.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

export default function Settings() {
  const [isOpen, setIsOpen] = useState(false);
  const context = useSettings();
  const panelRef = useRef(null);

  if (!context) return null;
  const { theme, setTheme } = context;

  // 预设颜色
  const presetColors = ['#3b82f6', '#22c55e', '#a855f7', '#ec4899', '#f59e0b', '#ef4444', '#06b6d4', '#f97316'];

  // 点击外部关闭
  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative">
      {/* 设置按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-sidebar-hover text-sidebar-text transition-colors"
        title="主题设置"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </button>

      {/* 弹出面板 */}
      {isOpen && (
        <div
          ref={panelRef}
          className="absolute bottom-full left-0 mb-2 p-4 bg-white rounded-xl shadow-xl border border-sidebar-border w-52 z-50 animate-in fade-in zoom-in duration-200"
        >
          {/* 当前颜色预览 */}
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-6 h-6 rounded-full border-2 border-gray-200 shadow-sm"
              style={{ backgroundColor: theme.color }}
            />
            <span className="text-xs text-gray-500 font-mono">{theme.color}</span>
          </div>

          {/* 预设颜色 */}
          <p className="text-xs text-gray-400 mb-2 font-medium">预设颜色</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {presetColors.map(color => (
              <button
                key={color}
                className={`w-7 h-7 rounded-full transition-transform hover:scale-115 ${
                  theme.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setTheme({ ...theme, color })}
                title={color}
              />
            ))}
          </div>

          {/* 分隔线 */}
          <div className="border-t border-gray-100 mb-3" />

          {/* 调色盘 */}
          <p className="text-xs text-gray-400 mb-2 font-medium">调色盘</p>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="color"
              value={theme.color}
              onChange={(e) => setTheme({ ...theme, color: e.target.value })}
              className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
            />
            <span className="text-xs text-gray-400">点击取色</span>
          </label>
        </div>
      )}
    </div>
  );
}