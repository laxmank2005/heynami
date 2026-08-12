import React from 'react';
import { BsMoonStarsFill, BsSunFill } from 'react-icons/bs';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center border
        ${theme === 'dark' 
          ? 'bg-stone-800 text-yellow-400 border-stone-700 hover:bg-stone-700' 
          : 'bg-white text-indigo-600 border-stone-200 hover:bg-stone-50'} 
        ${className}`}
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
    >
      {theme === 'dark' ? <BsSunFill size={18} /> : <BsMoonStarsFill size={18} />}
    </button>
  );
};

export default ThemeToggle;
