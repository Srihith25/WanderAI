'use client';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-md transition-colors ${
          theme === 'light'
            ? 'bg-white dark:bg-gray-600 shadow-sm'
            : 'hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
        title="Light mode"
      >
        ☀️
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-md transition-colors ${
          theme === 'dark'
            ? 'bg-white dark:bg-gray-600 shadow-sm'
            : 'hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
        title="Dark mode"
      >
        🌙
      </button>
      <button
        onClick={() => setTheme('auto')}
        className={`p-2 rounded-md transition-colors ${
          theme === 'auto'
            ? 'bg-white dark:bg-gray-600 shadow-sm'
            : 'hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
        title="Auto mode"
      >
        💻
      </button>
    </div>
  );
}