import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { ErrorPage } from '../components';
import { Dashboard } from '../modules/dashboard';
import {
  Create as JobCreate,
  Edit as JobEdit,
  Listing as JobListing,
  View as JobView,
} from '../modules/job';
import { Navbar } from '../modules/navbar';
import { Login, Profile, Register } from '../modules/user';

import { ProtectedRoute, PublicRoute } from './auth';

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path='/'
        element={
          <PublicRoute>
            <Navbar />
          </PublicRoute>
        }
      >
        <Route index element={<Dashboard />} />
      </Route>
      <Route
        path='jobs'
        element={
          <PublicRoute>
            <Navbar />
          </PublicRoute>
        }
      >
        <Route index element={<JobListing />} />
      </Route>
      <Route
        path='jobs/create'
        element={
          <ProtectedRoute>
            <Navbar />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to='single' replace />} />
        <Route path='single' element={<JobCreate uploadType='single' />} />
        <Route path='bulk' element={<JobCreate uploadType='bulk' />} />
      </Route>
      <Route
        path='/jobs/:jobId'
        element={
          <PublicRoute>
            <Navbar />
          </PublicRoute>
        }
      >
        <Route index element={<JobView />} />
      </Route>
      <Route
        path='/edit/:jobId'
        element={
          <ProtectedRoute>
            <Navbar />
          </ProtectedRoute>
        }
      >
        <Route index element={<JobEdit />} />
      </Route>
      <Route
        path='profile'
        element={
          <ProtectedRoute>
            <Navbar />
          </ProtectedRoute>
        }
      >
        <Route index element={<Profile />} />
      </Route>
      <Route
        path='register'
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path='login'
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route path='*' element={<ErrorPage />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
