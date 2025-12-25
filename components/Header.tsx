import React from 'react';
import { Scale, Moon, Sun } from 'lucide-react';
import { APP_NAME } from '../constants';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  goHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode, goHome }) => {
  return (
    <header className="bg-navy-900 text-white shadow-lg sticky top-0 z-50 border-b border-gold-500">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          onClick={goHome}
          className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="bg-gold-500 p-1.5 rounded-full text-navy-900">
            <Scale size={24} strokeWidth={2.5} />
          </div>
          <h1 className="text-xl md:text-2xl font-serif font-bold tracking-wide text-gold-400">
            {APP_NAME}
          </h1>
        </div>

        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-navy-800 text-gold-400 transition-colors"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Header;