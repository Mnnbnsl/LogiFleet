import React, { useState } from 'react';
import AuthForm from './components/AuthForm';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark like your reference
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className={`min-h-screen transition-colors duration-300 flex items-center justify-center p-4 sm:p-6 md:p-12 font-sans antialiased ${isDarkMode ? 'bg-[#0b0f19] dark' : 'bg-[#f8fafc]'}`}>
      <AuthForm 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        isRegister={isRegister}
        setIsRegister={setIsRegister}
      />
    </div>
  );
}

export default App;