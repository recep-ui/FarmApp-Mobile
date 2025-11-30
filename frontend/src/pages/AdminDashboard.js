import React, { useState, useEffect } from 'react';
import { userService } from '../services';
import Layout from '../components/Layout';
import '../styles/Dashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [activityLogs, setActivityLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAdminData();
    }, []);

    const loadAdminData = async () => {
        try {
            setLoading(true);
            const [statsResponse, logsResponse] = await Promise.all([
                userService.getSystemStats(),
                userService.getActivityLogs(20)
            ]);

            if (statsResponse.data.success) {
                setStats(statsResponse.data.data);
            }
            if (logsResponse.data.success) {
                setActivityLogs(logsResponse.data.data);
            }
        } catch (err) {
            console.error('Admin verileri yüklenirken hata:', err);
        } finally {
            setLoading(false);
        }
    };

    const getActivityIcon = (type) => {
        const icons = {
            animal: '🐄',
            task: '📋',
            employee: '👤',
            barn: '🏠'
        };
        return icons[type] || '📌';
    };

    if (loading) {
        return (
            <Layout>
                <div className="dashboard-container">
                    <p>Yükleniyor...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>🔐 Admin Paneli</h1>
                    <p>Sistem genelindeki tüm istatistikler ve yönetim</p>
                </div>

                {/* Kullanıcı İstatistikleri */}
                <div className="stats-section">
                    <h2>👥 Kullanıcı İstatistikleri</h2>
                    <div className="stats-grid">
                        <div className="stat-card stat-primary">
                            <div className="stat-icon">👥</div>
                            <div className="stat-details">
                                <h3>{stats?.users?.total_users || 0}</h3>
                                <p>Toplam Kullanıcı</p>
                            </div>
                        </div>
                        <div className="stat-card stat-success">
                            <div className="stat-icon">🔐</div>
                            <div className="stat-details">
                                <h3>{stats?.users?.admin_count || 0}</h3>
                                <p>Admin</p>
                            </div>
                        </div>
                        <div className="stat-card stat-info">
                            <div className="stat-icon">👤</div>
                            <div className="stat-details">
                                <h3>{stats?.users?.user_count || 0}</h3>
                                <p>Normal Kullanıcı</p>
                            </div>
                        </div>
                        <div className="stat-card stat-warning">
                            <div className="stat-icon">✅</div>
                            <div className="stat-details">
                                <h3>{stats?.users?.active_users || 0}</h3>
                                <p>Aktif Kullanıcı</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hayvan İstatistikleri */}
                <div className="stats-section">
                    <h2>🐄 Hayvan İstatistikleri</h2>
                    <div className="stats-grid">
                        <div className="stat-card stat-primary">
                            <div className="stat-icon">🐄</div>
                            <div className="stat-details">
                                <h3>{stats?.animals?.total_animals || 0}</h3>
                                <p>Toplam Hayvan</p>
                            </div>
                        </div>
                        <div className="stat-card stat-success">
                            <div className="stat-icon">💚</div>
                            <div className="stat-details">
                                <h3>{stats?.animals?.alive_animals || 0}</h3>
                                <p>Canlı</p>
                            </div>
                        </div>
                        <div className="stat-card stat-info">
                            <div className="stat-icon">💰</div>
                            <div className="stat-details">
                                <h3>{stats?.animals?.sold_animals || 0}</h3>
                                <p>Satılan</p>
                            </div>
                        </div>
                        <div className="stat-card stat-danger">
                            <div className="stat-icon">💔</div>
                            <div className="stat-details">
                                <h3>{stats?.animals?.dead_animals || 0}</h3>
                                <p>Ölü</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ahır ve Çalışan İstatistikleri */}
                <div className="stats-section">
                    <h2>🏠 Tesis ve Personel</h2>
                    <div className="stats-grid">
                        <div className="stat-card stat-primary">
                            <div className="stat-icon">🏠</div>
                            <div className="stat-details">
                                <h3>{stats?.barns?.total_barns || 0}</h3>
                                <p>Toplam Ahır</p>
                            </div>
                        </div>
                        <div className="stat-card stat-warning">
                            <div className="stat-icon">📦</div>
                            <div className="stat-details">
                                <h3>{stats?.barns?.total_capacity || 0}</h3>
                                <p>Toplam Kapasite</p>
                            </div>
                        </div>
                        <div className="stat-card stat-info">
                            <div className="stat-icon">👷</div>
                            <div className="stat-details">
                                <h3>{stats?.employees?.total_employees || 0}</h3>
                                <p>Toplam Çalışan</p>
                            </div>
                        </div>
                        <div className="stat-card stat-success">
                            <div className="stat-icon">✅</div>
                            <div className="stat-details">
                                <h3>{stats?.employees?.active_employees || 0}</h3>
                                <p>Aktif Çalışan</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Görev İstatistikleri */}
                <div className="stats-section">
                    <h2>📋 Görev Durumları</h2>
                    <div className="stats-grid">
                        <div className="stat-card stat-primary">
                            <div className="stat-icon">📋</div>
                            <div className="stat-details">
                                <h3>{stats?.tasks?.total_tasks || 0}</h3>
                                <p>Toplam Görev</p>
                            </div>
                        </div>
                        <div className="stat-card stat-warning">
                            <div className="stat-icon">⏳</div>
                            <div className="stat-details">
                                <h3>{stats?.tasks?.pending_tasks || 0}</h3>
                                <p>Bekleyen</p>
                            </div>
                        </div>
                        <div className="stat-card stat-info">
                            <div className="stat-icon">🔄</div>
                            <div className="stat-details">
                                <h3>{stats?.tasks?.in_progress_tasks || 0}</h3>
                                <p>Devam Eden</p>
                            </div>
                        </div>
                        <div className="stat-card stat-success">
                            <div className="stat-icon">✅</div>
                            <div className="stat-details">
                                <h3>{stats?.tasks?.completed_tasks || 0}</h3>
                                <p>Tamamlanan</p>
                            </div>
                        </div>
                        <div className="stat-card stat-danger">
                            <div className="stat-icon">⚠️</div>
                            <div className="stat-details">
                                <h3>{stats?.tasks?.overdue_tasks || 0}</h3>
                                <p>Gecikmiş</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Son Aktiviteler */}
                <div className="stats-section">
                    <h2>📊 Son Aktiviteler</h2>
                    <div className="activity-list">
                        {activityLogs.length === 0 ? (
                            <p style={{textAlign: 'center', color: '#666'}}>Henüz aktivite yok</p>
                        ) : (
                            activityLogs.map((log, index) => (
                                <div key={index} className="activity-item">
                                    <span className="activity-icon">{getActivityIcon(log.type)}</span>
                                    <div className="activity-content">
                                        <strong>{log.name}</strong>
                                        <span className="activity-type">({log.type})</span>
                                    </div>
                                    <span className="activity-time">
                                        {new Date(log.timestamp).toLocaleString('tr-TR')}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Son Kayıt Tarihleri */}
                {stats?.recent_activity && (
                    <div className="stats-section">
                        <h2>🕒 Son Kayıt Tarihleri</h2>
                        <div className="recent-activity-grid">
                            <div className="recent-item">
                                <span>🐄 Son Hayvan:</span>
                                <strong>
                                    {stats.recent_activity.last_animal_added 
                                        ? new Date(stats.recent_activity.last_animal_added).toLocaleString('tr-TR')
                                        : 'Yok'}
                                </strong>
                            </div>
                            <div className="recent-item">
                                <span>🏥 Son Sağlık Kaydı:</span>
                                <strong>
                                    {stats.recent_activity.last_health_record 
                                        ? new Date(stats.recent_activity.last_health_record).toLocaleString('tr-TR')
                                        : 'Yok'}
                                </strong>
                            </div>
                            <div className="recent-item">
                                <span>📦 Son Üretim:</span>
                                <strong>
                                    {stats.recent_activity.last_production 
                                        ? new Date(stats.recent_activity.last_production).toLocaleString('tr-TR')
                                        : 'Yok'}
                                </strong>
                            </div>
                            <div className="recent-item">
                                <span>📋 Son Görev:</span>
                                <strong>
                                    {stats.recent_activity.last_task_created 
                                        ? new Date(stats.recent_activity.last_task_created).toLocaleString('tr-TR')
                                        : 'Yok'}
                                </strong>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default AdminDashboard;
