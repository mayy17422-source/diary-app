import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

// ✅ 从 localStorage 读取初始值
function getInitialTheme() {
  try {
    const saved = localStorage.getItem('diary_theme');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { color: parsed.color || '#3b82f6', dotSize: parsed.dotSize || 'sm' };
    }
  } catch {}
  return { color: '#3b82f6', dotSize: 'sm' };
}

export function SettingsProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  // ✅ 每次颜色变化时同步到 CSS 变量 + localStorage
  useEffect(() => {
    document.documentElement.style.setProperty('--dot-color', theme.color);
    document.documentElement.style.setProperty('--accent-color', theme.color);
    localStorage.setItem('diary_theme', JSON.stringify(theme));
  }, [theme]);

  return (
    <SettingsContext.Provider value={{ theme, setTheme }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);