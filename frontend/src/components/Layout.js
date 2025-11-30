import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Layout.css';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>Farm Management</h2>
                </div>
                
                <nav className="sidebar-nav">
                    <Link to="/dashboard" className={isActive('/dashboard')}>
                        <span>📊</span> Dashboard
                    </Link>
                    
                    {user?.role === 'admin' && (
                        <>
                            <div className="nav-divider">Admin Paneli</div>
                            <Link to="/admin" className={isActive('/admin')}>
                                <span>🔐</span> Admin Dashboard
                            </Link>
                            <Link to="/users" className={isActive('/users')}>
                                <span>👥</span> Kullanıcı Yönetimi
                            </Link>
                        </>
                    )}
                    
                    <div className="nav-divider">Çiftlik Yönetimi</div>
                    <Link to="/animals" className={isActive('/animals')}>
                        <span>🐄</span> Hayvanlar
                    </Link>
                    <Link to="/barns" className={isActive('/barns')}>
                        <span>🏠</span> Ahırlar
                    </Link>
                    <Link to="/health-records" className={isActive('/health-records')}>
                        <span>💊</span> Sağlık Kayıtları
                    </Link>
                    <Link to="/feeding-records" className={isActive('/feeding-records')}>
                        <span>🌾</span> Besleme Kayıtları
                    </Link>
                    <Link to="/production-records" className={isActive('/production-records')}>
                        <span>📦</span> Üretim Kayıtları
                    </Link>
                    {user?.role === 'admin' && (
                        <Link to="/employees" className={isActive('/employees')}>
                            <span>�</span> Çalışanlar
                        </Link>
                    )}
                    <Link to="/tasks" className={isActive('/tasks')}>
                        <span>✓</span> Görevler
                    </Link>
                </nav>
            </aside>

            <div className="main-content">
                <header className="top-bar">
                    <div className="user-info">
                        <span>
                            Hoş geldin, <strong>{user?.firstName || user?.username}</strong>
                            {user?.role === 'admin' && <span className="admin-badge">Admin</span>}
                        </span>
                        <button onClick={handleLogout} className="btn-logout">
                            Çıkış
                        </button>
                    </div>
                </header>

                <main className="content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
