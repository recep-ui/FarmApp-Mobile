import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { taskService, employeeService } from '../services';
import '../styles/Common.css';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assigned_employee_id: '',
        due_date: '',
        status: 'pending',
        priority: 'medium'
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Sıralı istekler
            const tasksRes = await taskService.getAll();
            setTasks(tasksRes.data.data);

            const employeesRes = await employeeService.getAll();
            setEmployees(employeesRes.data.data);
        } catch (error) {
            alert('Veri yüklenirken hata: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await taskService.update(editingId, formData);
                alert('Görev güncellendi');
            } else {
                await taskService.create(formData);
                alert('Görev eklendi');
            }
            resetForm();
            loadData();
        } catch (error) {
            alert('Hata: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleEdit = (task) => {
        setFormData({
            title: task.title,
            description: task.description || '',
            assigned_employee_id: task.assigned_employee_id || '',
            due_date: task.due_date ? task.due_date.split('T')[0] : '',
            status: task.status,
            priority: task.priority || 'medium'
        });
        setEditingId(task.task_id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu görevi silmek istediğinize emin misiniz?')) return;
        try {
            await taskService.delete(id);
            alert('Görev silindi');
            loadData();
        } catch (error) {
            alert('Hata: ' + (error.response?.data?.message || error.message));
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            assigned_employee_id: '',
            due_date: '',
            status: 'pending',
            priority: 'medium'
        });
        setEditingId(null);
        setShowForm(false);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'red';
            case 'low': return 'green';
            default: return 'yellow';
        }
    };

    const getStatusText = (status) => {
        const statusMap = {
            'pending': 'Bekliyor',
            'in_progress': 'Devam Ediyor',
            'completed': 'Tamamlandı',
            'cancelled': 'İptal Edildi'
        };
        return statusMap[status] || status;
    };

    if (loading) return <Layout><div className="loading">Yükleniyor...</div></Layout>;

    return (
        <Layout>
            <div className="page">
                <div className="page-header">
                    <h1>Görevler</h1>
                    <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                        {showForm ? 'İptal' : '+ Yeni Görev'}
                    </button>
                </div>

                {showForm && (
                    <div className="form-card">
                        <h2>{editingId ? 'Görev Düzenle' : 'Yeni Görev Ekle'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Görev Başlığı *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    placeholder="Görev başlığı"
                                />
                            </div>
                            <div className="form-group">
                                <label>Açıklama</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Görev detayları"
                                ></textarea>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Atanan Çalışan</label>
                                    <select value={formData.assigned_employee_id} onChange={(e) => setFormData({ ...formData, assigned_employee_id: e.target.value })}>
                                        <option value="">Seçin</option>
                                        {employees.filter(e => e.status === 'active').map(employee => (
                                            <option key={employee.employee_id} value={employee.employee_id}>
                                                {employee.first_name} {employee.last_name} - {employee.position}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Bitiş Tarihi</label>
                                    <input
                                        type="date"
                                        value={formData.due_date}
                                        onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Durum</label>
                                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                        <option value="pending">Bekliyor</option>
                                        <option value="in_progress">Devam Ediyor</option>
                                        <option value="completed">Tamamlandı</option>
                                        <option value="cancelled">İptal Edildi</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Öncelik</label>
                                    <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
                                        <option value="low">Düşük</option>
                                        <option value="medium">Orta</option>
                                        <option value="high">Yüksek</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-primary">{editingId ? 'Güncelle' : 'Ekle'}</button>
                                <button type="button" onClick={resetForm} className="btn-secondary">İptal</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="table-card">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Başlık</th>
                                <th>Atanan</th>
                                <th>Bitiş Tarihi</th>
                                <th>Durum</th>
                                <th>Öncelik</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map(task => (
                                <tr key={task.task_id}>
                                    <td>{task.task_id}</td>
                                    <td><strong>{task.title}</strong></td>
                                    <td>{task.employee_name || 'Atanmamış'}</td>
                                    <td>
                                        {task.due_date ? (
                                            <span style={{
                                                color: new Date(task.due_date) < new Date() && task.status !== 'completed' ? 'red' : 'inherit'
                                            }}>
                                                {new Date(task.due_date).toLocaleDateString('tr-TR')}
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td><span className={`badge ${task.status}`}>{getStatusText(task.status)}</span></td>
                                    <td><span className={`badge ${getPriorityColor(task.priority)}`}>{task.priority}</span></td>
                                    <td>
                                        <button onClick={() => handleEdit(task)} className="btn-sm btn-edit">Düzenle</button>
                                        <button onClick={() => handleDelete(task.task_id)} className="btn-sm btn-delete">Sil</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {tasks.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            Henüz görev kaydı yok.
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Tasks;
