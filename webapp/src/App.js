// src/App.jsx
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import './App.css';
import routes from './routes/routes';

function AppRoutes() {
  const element = useRoutes(routes);
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen w-full">
          <div className="flex flex-col items-center space-y-4">
            <svg
              className="animate-spin h-10 w-10 text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <p className="text-gray-600 text-sm">Cargando...</p>
          </div>
        </div>
      }
    >
      {element}
    </Suspense>

  );
}

export default function App() {
  /*
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();

      // F5
      if (key === 'f5') {
        e.preventDefault();
        e.stopPropagation();
      }

      // Ctrl+R / Cmd+R
      if ((e.ctrlKey || e.metaKey) && key === 'r') {
        e.preventDefault();
        e.stopPropagation();
      }

      // Ctrl+Shift+R / Cmd+Shift+R
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && key === 'r') {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleBeforeUnload = (e) => {
      // Mensaje no siempre es mostrado, depende del navegador
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);*/
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
