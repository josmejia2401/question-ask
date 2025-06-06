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
const EditProfilePage = lazy(() => import('../features/profile/edit'));
const CreateFormPage = lazy(() => import('../features/forms/create'));
const ViewFormPage = lazy(() => import('../features/forms/view'));
const EditFormPage = lazy(() => import('../features/forms/edit'));

const routes = [
  {
    path: '/',
    element: <Navigate to="/index" />,
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
    path: '/forms/create',
    element: (
      <PrivateRoute>
        <MainLayout><CreateFormPage /></MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '/forms/viewer',
    element: (
      <PrivateRoute>
        <MainLayout><ViewFormPage /></MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '/forms/edit',
    element: (
      <PrivateRoute>
        <MainLayout><EditFormPage /></MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '/profile/edit',
    element: (
      <PrivateRoute>
        <MainLayout><EditProfilePage /></MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default routes;
