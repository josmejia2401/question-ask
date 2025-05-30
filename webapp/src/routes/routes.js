// src/routes/routes.js
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AuthLayout from '../layouts/auth/index';
import MainLayout from '../layouts/main/index';

// Lazy load de páginas
const IndexPage = lazy(() => import('../pages/index'));
const NotFoundPage = lazy(() => import('../pages/not-found'));

const LoginPage = lazy(() => import('../features/auth/login'));
const RegisterPage = lazy(() => import('../features/auth/register'));
const DashboardPage = lazy(() => import('../features/dashboard'));
const UsersPage = lazy(() => import('../features/users'));
const ContentsPage = lazy(() => import('../features/contents'));
const ProfilePage = lazy(() => import('../features/profile'));

const routes = [
  {
    path: '/',
    element: <Navigate to="/dashboard" />,
  },
  {
    path: '/index',
    element: (
      <IndexPage></IndexPage>
    ),
  },
  {
    path: '/auth/login',
    element: <AuthLayout><LoginPage /></AuthLayout>,
  },
  {
    path: '/auth/register',
    element: <AuthLayout><RegisterPage /></AuthLayout>,
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <MainLayout><DashboardPage /></MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '/users',
    element: (
      <PrivateRoute>
        <MainLayout><UsersPage /></MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '/contents',
    element: (
      <PrivateRoute>
        <MainLayout><ContentsPage /></MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <PrivateRoute>
        <MainLayout><ProfilePage /></MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default routes;
