import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import '../styles/Auth.css';

const VerifyEmail = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    const userId = location.state?.userId;
    const email = location.state?.email;
    const token = location.state?.token;
    const displayedCode = location.state?.verificationToken; // Geliştirme için

    useEffect(() => {
        if (!userId || !email) {
            navigate('/register');
        }
    }, [userId, email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (verificationCode.length !== 6) {
            setError('Doğrulama kodu 6 haneli olmalıdır');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/auth/verify-email', {
                userId: userId,
                verificationCode: verificationCode
            });

            if (response.data.success) {
                setSuccess('Email başarıyla doğrulandı! Yönlendiriliyorsunuz...');
                
                // Token'ı localStorage'a kaydet
                localStorage.setItem('token', token);
                
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Doğrulama başarısız');
        }
        
        setLoading(false);
    };

    const handleResend = async () => {
        setResendLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await api.post('/auth/resend-verification', {
                userId: userId
            });

            if (response.data.success) {
                setSuccess('Yeni doğrulama kodu gönderildi');
                // Geliştirme ortamında kodu göster
                if (response.data.data?.verificationToken) {
                    console.log('Yeni Doğrulama Kodu:', response.data.data.verificationToken);
                }
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Kod gönderilemedi');
        }
        
        setResendLoading(false);
    };

    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setVerificationCode(value);
        setError('');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Email Doğrulama</h1>
                    <p style={{color: '#666', fontSize: '0.9rem', marginTop: '8px'}}>
                        <strong>{email}</strong> adresine gönderilen 6 haneli kodu girin
                    </p>
                </div>

                {/* Geliştirme ortamı için kod gösterimi */}
                {displayedCode && (
                    <div style={{
                        background: '#fff3cd',
                        border: '1px solid #ffc107',
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '16px',
                        textAlign: 'center'
                    }}>
                        <strong>Test Kodu:</strong> <span style={{fontSize: '1.2rem', letterSpacing: '2px'}}>{displayedCode}</span>
                    </div>
                )}

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="verificationCode">Doğrulama Kodu</label>
                        <input
                            type="text"
                            id="verificationCode"
                            name="verificationCode"
                            value={verificationCode}
                            onChange={handleChange}
                            placeholder="6 haneli kod"
                            maxLength={6}
                            required
                            style={{
                                fontSize: '1.5rem',
                                letterSpacing: '8px',
                                textAlign: 'center'
                            }}
                        />
                        <small style={{color: '#666', fontSize: '0.85rem', marginTop: '4px', display: 'block'}}>
                            Kodu almadınız mı?
                        </small>
                    </div>

                    <button 
                        type="submit" 
                        className="btn-primary"
                        disabled={loading || verificationCode.length !== 6}
                    >
                        {loading ? 'Doğrulanıyor...' : 'Doğrula'}
                    </button>

                    <button 
                        type="button"
                        onClick={handleResend}
                        className="btn-secondary"
                        disabled={resendLoading}
                        style={{marginTop: '12px'}}
                    >
                        {resendLoading ? 'Gönderiliyor...' : 'Yeni Kod Gönder'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }} style={{color: '#007bff'}}>
                            Kayıt sayfasına dön
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
