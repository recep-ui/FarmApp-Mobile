import React, { useState, useEffect } from 'react';
import { userService } from '../services';
import Layout from '../components/Layout';
import '../styles/Common.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        role: 'user',
        is_active: true
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getAll();
            if (response.data.success) {
                setUsers(response.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Kullanıcılar yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            role: user.role,
            is_active: user.is_active === 1
        });
        setError('');
    };

    const handleCancel = () => {
        setEditingUser(null);
        setFormData({
            username: '',
            email: '',
            first_name: '',
            last_name: '',
            role: 'user',
            is_active: true
        });
        setError('');
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updateData = {
                ...formData,
                is_active: formData.is_active ? 1 : 0
            };
            
            const response = await userService.update(editingUser.user_id, updateData);
            if (response.data.success) {
                await loadUsers();
                handleCancel();
                alert('Kullanıcı başarıyla güncellendi!');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Kullanıcı güncellenirken hata oluştu');
        }
    };

    const handleToggleStatus = async (userId) => {
        if (window.confirm('Kullanıcı durumunu değiştirmek istediğinizden emin misiniz?')) {
            try {
                const response = await userService.toggleStatus(userId);
                if (response.data.success) {
                    await loadUsers();
                    alert(response.data.message);
                }
            } catch (err) {
                alert(err.response?.data?.message || 'Durum değiştirilirken hata oluştu');
            }
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!')) {
            try {
                const response = await userService.delete(userId);
                if (response.data.success) {
                    await loadUsers();
                    alert('Kullanıcı başarıyla silindi!');
                }
            } catch (err) {
                alert(err.response?.data?.message || 'Kullanıcı silinirken hata oluştu');
            }
        }
    };

    const handleResetPassword = async (userId) => {
        setEditingUser({ user_id: userId });
        setShowPasswordModal(true);
        setNewPassword('');
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            alert('Şifre en az 6 karakter olmalı');
            return;
        }

        try {
            const response = await userService.resetPassword(editingUser.user_id, newPassword);
            if (response.data.success) {
                setShowPasswordModal(false);
                setNewPassword('');
                setEditingUser(null);
                alert('Şifre başarıyla sıfırlandı!');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Şifre sıfırlanırken hata oluştu');
        }
    };

    const getRoleBadge = (role) => {
        return role === 'admin' 
            ? <span className="badge badge-primary">Admin</span>
            : <span className="badge badge-secondary">Kullanıcı</span>;
    };

    const getStatusBadge = (isActive) => {
        return isActive === 1
            ? <span className="badge badge-active">Aktif</span>
            : <span className="badge badge-inactive">Pasif</span>;
    };

    if (loading) {
        return (
            <Layout>
                <div className="page-container">
                    <p>Yükleniyor...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="page-container">
                <div className="page-header">
                    <h1>👥 Kullanıcı Yönetimi</h1>
                    <p className="page-description">Sistem kullanıcılarını yönetin (Sadece Admin)</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                {editingUser && (
                    <div className="form-card">
                        <div className="card-header">
                            <h2>Kullanıcı Düzenle</h2>
                        </div>
                        <form onSubmit={handleUpdate} className="form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Kullanıcı Adı *</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Ad</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Soyad</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Rol *</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="user">Kullanıcı</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            checked={formData.is_active}
                                            onChange={handleChange}
                                            style={{width: 'auto'}}
                                        />
                                        Aktif Kullanıcı
                                    </label>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-primary">Güncelle</button>
                                <button type="button" className="btn-secondary" onClick={handleCancel}>
                                    İptal
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="table-card">
                    <div className="card-header">
                        <h2>Kullanıcı Listesi</h2>
                        <span className="badge badge-info">{users.length} Kullanıcı</span>
                    </div>
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Kullanıcı Adı</th>
                                    <th>Email</th>
                                    <th>Ad Soyad</th>
                                    <th>Rol</th>
                                    <th>Durum</th>
                                    <th>Kayıt Tarihi</th>
                                    <th>İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" style={{textAlign: 'center'}}>
                                            Kayıtlı kullanıcı bulunamadı
                                        </td>
                                    </tr>
                                ) : (
                                    users.map(user => (
                                        <tr key={user.user_id}>
                                            <td>{user.user_id}</td>
                                            <td><strong>{user.username}</strong></td>
                                            <td>{user.email}</td>
                                            <td>{user.first_name || user.last_name 
                                                ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                                                : '-'
                                            }</td>
                                            <td>{getRoleBadge(user.role)}</td>
                                            <td>{getStatusBadge(user.is_active)}</td>
                                            <td>{new Date(user.created_at).toLocaleDateString('tr-TR')}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn-sm btn-edit"
                                                        onClick={() => handleEdit(user)}
                                                        title="Düzenle"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        className="btn-sm btn-warning"
                                                        onClick={() => handleResetPassword(user.user_id)}
                                                        title="Şifre Sıfırla"
                                                    >
                                                        🔑
                                                    </button>
                                                    <button
                                                        className="btn-sm btn-secondary"
                                                        onClick={() => handleToggleStatus(user.user_id)}
                                                        title={user.is_active ? 'Pasif Yap' : 'Aktif Yap'}
                                                    >
                                                        {user.is_active ? '🔒' : '🔓'}
                                                    </button>
                                                    <button
                                                        className="btn-sm btn-delete"
                                                        onClick={() => handleDelete(user.user_id)}
                                                        title="Sil"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Şifre Sıfırlama Modal */}
                {showPasswordModal && (
                    <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Şifre Sıfırla</h2>
                                <button 
                                    className="modal-close"
                                    onClick={() => setShowPasswordModal(false)}
                                >
                                    ✕
                                </button>
                            </div>
                            <form onSubmit={handlePasswordSubmit}>
                                <div className="form-group">
                                    <label>Yeni Şifre (En az 6 karakter)</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        placeholder="Yeni şifre"
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn-primary">
                                        Şifreyi Sıfırla
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn-secondary"
                                        onClick={() => setShowPasswordModal(false)}
                                    >
                                        İptal
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Users;
