import { ThemeProvider } from './context/ThemeContext';
import Board from './components/Board/Board';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
        <ThemeToggle />
        <main className="h-screen w-screen p-6">
          <div className="flex items-center gap-2 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              Kanban Board
            </h1>
            <div className="flex gap-2">
              <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="h-[calc(100vh-140px)]">
            <Board />
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
