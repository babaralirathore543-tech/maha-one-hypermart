import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-1.5 sm:p-2 rounded-full hover:bg-[#F8FAFC] dark:hover:bg-gray-800 transition-all duration-300 relative group"
      aria-label="Toggle theme"
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      {theme === 'light' ? (
        <FaMoon className="text-base sm:text-lg text-gray-600 dark:text-gray-400 hover:text-[#D4AF37] transition-colors" />
      ) : (
        <FaSun className="text-base sm:text-lg text-yellow-400 hover:text-[#D4AF37] transition-colors" />
      )}
    </button>
  );
};

export default ThemeToggle;