import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Sayfa yüklendiğinde kullanıcı bilgisini kontrol et
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await authService.login(username, password);
            if (response.success) {
                setUser(response.data);
                return { success: true };
            }
            return { success: false, message: response.message };
        } catch (error) {
            const errorData = error.response?.data;
            return { 
                success: false, 
                message: errorData?.message || 'Giriş başarısız',
                requiresVerification: errorData?.requiresVerification || false,
                userId: errorData?.userId,
                email: errorData?.email
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            if (response.success) {
                // Email doğrulaması gerektiği için user'ı set etme
                return { success: true, data: response.data };
            }
            return { success: false, message: response.message };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Kayıt başarısız' 
            };
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
