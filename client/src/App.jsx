import React from 'react';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import DiaryPage from './pages/DiaryPage';
import AuthPage from './pages/AuthPage';

const ThemeWrapper = ({ children }) => {
  const { theme } = useSettings();
  
  return (
    <div 
      style={{ '--accent-color': theme?.color || '#3b82f6' }} 
      className="w-full h-full"
    >
      {children}
    </div>
  );
};

function MainApp() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="h-screen bg-cream-50 flex items-center justify-center">
      <p className="text-ink-muted">加载中...</p>
    </div>;
  }
  
  if (!user) {
    return <AuthPage />;
  }
  
  return <DiaryPage />;
}

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ThemeWrapper>
          <MainApp />
        </ThemeWrapper>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
