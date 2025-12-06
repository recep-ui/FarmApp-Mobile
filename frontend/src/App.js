import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import BackgroundAnimation from './components/BackgroundAnimation';
import Login from './pages/Login';
import Register from './pages/Register';

import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Users from './pages/Users';
import Animals from './pages/Animals';
import Barns from './pages/Barns';
import HealthRecords from './pages/HealthRecords';
import FeedingRecords from './pages/FeedingRecords';
import ProductionRecords from './pages/ProductionRecords';
import Employees from './pages/Employees';
import Tasks from './pages/Tasks';
import './styles/App.css';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <BackgroundAnimation />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
                    <Route path="/animals" element={<ProtectedRoute><Animals /></ProtectedRoute>} />
                    <Route path="/barns" element={<ProtectedRoute><Barns /></ProtectedRoute>} />
                    <Route path="/health-records" element={<ProtectedRoute><HealthRecords /></ProtectedRoute>} />
                    <Route path="/feeding-records" element={<ProtectedRoute><FeedingRecords /></ProtectedRoute>} />
                    <Route path="/production-records" element={<ProtectedRoute><ProductionRecords /></ProtectedRoute>} />
                    <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
                    <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />

                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
