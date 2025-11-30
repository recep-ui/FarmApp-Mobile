import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { dashboardService } from '../services';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import '../styles/Dashboard.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        animals: {},
        production: [],
        tasks: {}
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const response = await dashboardService.getStats();
            setStats(response.data.data);
        } catch (error) {
            console.error('Dashboard yükleme hatası:', error);
        } finally {
            setLoading(false);
        }
    };

    // Hayvan dağılımı grafik verisi
    const animalChartData = {
        labels: ['İnek', 'Koyun', 'Tavuk', 'Keçi'],
        datasets: [{
            label: 'Hayvan Sayısı',
            data: [
                stats.animals.total_cows || 0,
                stats.animals.total_sheep || 0,
                stats.animals.total_chickens || 0,
                stats.animals.total_goats || 0
            ],
            backgroundColor: [
                'rgba(75, 192, 192, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(255, 99, 132, 0.8)',
                'rgba(153, 102, 255, 0.8)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 2
        }]
    };

    // Görev durumu grafik verisi
    const taskChartData = {
        labels: ['Bekleyen', 'Devam Eden', 'Tamamlanan', 'Geciken'],
        datasets: [{
            data: [
                stats.tasks.pending_tasks || 0,
                stats.tasks.in_progress_tasks || 0,
                stats.tasks.completed_tasks || 0,
                stats.tasks.overdue_tasks || 0
            ],
            backgroundColor: [
                'rgba(255, 206, 86, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(255, 99, 132, 0.8)'
            ],
            borderColor: [
                'rgba(255, 206, 86, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 2
        }]
    };

    // Üretim grafik verisi
    const productionChartData = {
        labels: stats.production.map(item => item.product_type),
        datasets: [{
            label: 'Toplam Üretim',
            data: stats.production.map(item => parseFloat(item.total_quantity)),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            borderRadius: 8
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif"
                    }
                }
            }
        }
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif"
                    },
                    padding: 15
                }
            }
        }
    };

    if (loading) {
        return <Layout><div className="loading">Yükleniyor...</div></Layout>;
    }

    return (
        <Layout>
            <div className="dashboard">
                <div className="dashboard-header">
                    <h1>📊 Dashboard</h1>
                    <p>Çiftlik yönetim sistemi genel görünümü</p>
                </div>

                {/* İstatistik Kartları */}
                <div className="stats-section">
                    <h2>🐄 Hayvan İstatistikleri</h2>
                    <div className="stats-grid">
                        <div className="stat-card stat-primary">
                            <div className="stat-icon">🐄</div>
                            <div className="stat-details">
                                <h3>{stats.animals.total_animals || 0}</h3>
                                <p>Toplam Hayvan</p>
                            </div>
                        </div>
                        <div className="stat-card stat-success">
                            <div className="stat-icon">🐮</div>
                            <div className="stat-details">
                                <h3>{stats.animals.total_cows || 0}</h3>
                                <p>İnekler</p>
                            </div>
                        </div>
                        <div className="stat-card stat-warning">
                            <div className="stat-icon">🐑</div>
                            <div className="stat-details">
                                <h3>{stats.animals.total_sheep || 0}</h3>
                                <p>Koyunlar</p>
                            </div>
                        </div>
                        <div className="stat-card stat-danger">
                            <div className="stat-icon">🐔</div>
                            <div className="stat-details">
                                <h3>{stats.animals.total_chickens || 0}</h3>
                                <p>Tavuklar</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Görev İstatistikleri */}
                <div className="stats-section">
                    <h2>📋 Görev Durumları</h2>
                    <div className="stats-grid">
                        <div className="stat-card stat-info">
                            <div className="stat-icon">📋</div>
                            <div className="stat-details">
                                <h3>{stats.tasks.total_tasks || 0}</h3>
                                <p>Toplam Görev</p>
                            </div>
                        </div>
                        <div className="stat-card stat-warning">
                            <div className="stat-icon">⏳</div>
                            <div className="stat-details">
                                <h3>{stats.tasks.pending_tasks || 0}</h3>
                                <p>Bekleyen</p>
                            </div>
                        </div>
                        <div className="stat-card stat-success">
                            <div className="stat-icon">✅</div>
                            <div className="stat-details">
                                <h3>{stats.tasks.completed_tasks || 0}</h3>
                                <p>Tamamlanan</p>
                            </div>
                        </div>
                        <div className="stat-card stat-danger">
                            <div className="stat-icon">⚠️</div>
                            <div className="stat-details">
                                <h3>{stats.tasks.overdue_tasks || 0}</h3>
                                <p>Geciken</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grafikler */}
                <div className="charts-section">
                    <div className="chart-row">
                        <div className="chart-card">
                            <h2>🐄 Hayvan Dağılımı</h2>
                            <div className="chart-container" style={{ height: '300px' }}>
                                <Bar data={animalChartData} options={chartOptions} />
                            </div>
                        </div>

                        <div className="chart-card">
                            <h2>📊 Görev Durumları</h2>
                            <div className="chart-container" style={{ height: '300px' }}>
                                <Doughnut data={taskChartData} options={doughnutOptions} />
                            </div>
                        </div>
                    </div>

                    {/* Ürün Türüne Göre Grafikler */}
                    {stats.production.length > 0 && (
                        <>
                            <div className="production-charts-header">
                                <h2>📦 Ürün Bazında Üretim Analizi</h2>
                            </div>
                            <div className="production-charts-grid">
                                {stats.production.map((product, index) => {
                                    const productData = {
                                        labels: ['Toplam Üretim', 'Ortalama', 'Kayıt Sayısı'],
                                        datasets: [{
                                            label: product.product_type,
                                            data: [
                                                parseFloat(product.total_quantity),
                                                parseFloat(product.avg_quantity),
                                                parseInt(product.record_count)
                                            ],
                                            backgroundColor: [
                                                'rgba(75, 192, 192, 0.6)',
                                                'rgba(54, 162, 235, 0.6)',
                                                'rgba(255, 206, 86, 0.6)'
                                            ],
                                            borderColor: [
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)'
                                            ],
                                            borderWidth: 2,
                                            borderRadius: 8
                                        }]
                                    };

                                    const getProductIcon = (type) => {
                                        const icons = {
                                            'Milk': '🥛',
                                            'Egg': '🥚',
                                            'Wool': '🧶',
                                            'Meat': '🥩',
                                            'Honey': '🍯'
                                        };
                                        return icons[type] || '📦';
                                    };

                                    return (
                                        <div key={index} className="product-chart-card">
                                            <div className="product-header">
                                                <span className="product-icon">{getProductIcon(product.product_type)}</span>
                                                <h3>{product.product_type}</h3>
                                            </div>
                                            <div className="product-stats">
                                                <div className="product-stat">
                                                    <span className="stat-label">Toplam</span>
                                                    <span className="stat-value">{parseFloat(product.total_quantity).toFixed(2)} {product.unit}</span>
                                                </div>
                                                <div className="product-stat">
                                                    <span className="stat-label">Ortalama</span>
                                                    <span className="stat-value">{parseFloat(product.avg_quantity).toFixed(2)} {product.unit}</span>
                                                </div>
                                                <div className="product-stat">
                                                    <span className="stat-label">Kayıt</span>
                                                    <span className="stat-value">{product.record_count} adet</span>
                                                </div>
                                            </div>
                                            <div className="chart-container" style={{ height: '200px', marginTop: '16px' }}>
                                                <Bar
                                                    data={productData}
                                                    options={{
                                                        ...chartOptions,
                                                        plugins: {
                                                            legend: {
                                                                display: false
                                                            }
                                                        },
                                                        scales: {
                                                            y: {
                                                                beginAtZero: true,
                                                                ticks: {
                                                                    font: {
                                                                        size: 10
                                                                    }
                                                                }
                                                            },
                                                            x: {
                                                                ticks: {
                                                                    font: {
                                                                        size: 10
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* Üretim Tablosu */}
                {stats.production.length > 0 && (
                    <div className="production-section">
                        <h2>📦 Detaylı Üretim İstatistikleri</h2>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Ürün Tipi</th>
                                    <th>Toplam Miktar</th>
                                    <th>Ortalama</th>
                                    <th>Kayıt Sayısı</th>
                                    <th>Birim</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.production.map((item, index) => (
                                    <tr key={index}>
                                        <td><strong>{item.product_type}</strong></td>
                                        <td>{parseFloat(item.total_quantity).toFixed(2)}</td>
                                        <td>{parseFloat(item.avg_quantity).toFixed(2)}</td>
                                        <td>{item.record_count}</td>
                                        <td>{item.unit}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Dashboard;
