import React from 'react';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import DiaryPage from './pages/DiaryPage';

const ThemeWrapper = ({ children }) => {
  const { theme } = useSettings();
  
  // 调试：每次颜色变化时控制台会打印
  console.log('🎨 当前主题颜色:', theme?.color);
  
  return (
    <div 
      style={{ '--accent-color': theme?.color || '#3b82f6' }} 
      className="w-full h-full"
    >
      {children}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ThemeWrapper>
          <DiaryPage />
        </ThemeWrapper>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;