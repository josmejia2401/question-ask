// src/App.jsx
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { Suspense } from 'react';
import './App.css';
import routes from './routes/routes';

function AppRoutes() {
  const element = useRoutes(routes);
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      {element}
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
