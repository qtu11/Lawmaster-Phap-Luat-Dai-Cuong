import React from 'react';
import { Scale, Moon, Sun } from 'lucide-react';
import { APPLICATION_NAME } from '../constants';

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
            {APPLICATION_NAME}
          </h1>
        </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-navy-800 text-gold-400 transition-colors"
                aria-label="Toggle Dark Mode"
                title="Chuyển giao diện sáng/tối"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button
                onClick={goHome}
                className="p-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center gap-2"
                aria-label="Thoát về màn hình chính"
                title="Thoát"
              >
                Thoát
              </button>
            </div>
      </div>
    </header>
  );
};

export default Header;