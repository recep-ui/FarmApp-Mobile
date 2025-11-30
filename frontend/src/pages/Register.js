import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        role: 'user'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();
    const { register } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const validateEmail = (email) => {
        // Email formatı kontrolü
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return false;
        }

        // Yaygın geçersiz email domainlerini engelle
        const invalidDomains = ['test.com', 'example.com', 'temp.com', 'fake.com'];
        const domain = email.split('@')[1];
        if (invalidDomains.includes(domain)) {
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Email kontrolü
        if (!validateEmail(formData.email)) {
            setError('Geçerli bir email adresi girin');
            setLoading(false);
            return;
        }

        // Şifre kontrolü
        if (formData.password !== formData.confirmPassword) {
            setError('Şifreler eşleşmiyor');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Şifre en az 6 karakter olmalı');
            setLoading(false);
            return;
        }

        const { confirmPassword, ...registerData } = formData;
        const result = await register(registerData);

        if (result.success) {
            // Email doğrulama sayfasına yönlendir
            // Başarılı kayıt mesajı göster ve login sayfasına yönlendir
            setSuccessMessage('Kayıt başarılı! Hesabınız yönetici onayı bekliyor. Giriş sayfasına yönlendiriliyorsunuz...');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } else {
            setError(result.message || 'Kayıt başarısız');
        }

        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Farm Management System</h1>
                    <h2>Kayıt Ol</h2>
                </div>

                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message" style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{successMessage}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="first_name">Ad</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                placeholder="Adınız"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="last_name">Soyad</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Soyadınız"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Kullanıcı Adı *</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Kullanıcı adı seçin"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="email@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Rol *</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className="form-select"
                        >
                            <option value="user">Kullanıcı</option>
                            <option value="admin">Admin</option>
                        </select>
                        <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                            Admin: Tüm yetkilere sahip | Kullanıcı: Sınırlı yetkiler
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Şifre *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="En az 6 karakter"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Şifre Tekrar *</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Şifrenizi tekrar girin"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
