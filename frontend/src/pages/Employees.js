import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { employeeService } from '../services';
import '../styles/Common.css';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        position: '',
        contact_info: '',
        hire_date: '',
        status: 'active'
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const response = await employeeService.getAll();
            setEmployees(response.data.data);
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
                await employeeService.update(editingId, formData);
                alert('Çalışan güncellendi');
            } else {
                await employeeService.create(formData);
                alert('Çalışan eklendi');
            }
            resetForm();
            loadData();
        } catch (error) {
            alert('Hata: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleEdit = (employee) => {
        setFormData({
            first_name: employee.first_name,
            last_name: employee.last_name,
            position: employee.position || '',
            contact_info: employee.contact_info || '',
            hire_date: employee.hire_date ? employee.hire_date.split('T')[0] : '',
            status: employee.status
        });
        setEditingId(employee.employee_id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu çalışanı silmek istediğinize emin misiniz?')) return;
        try {
            await employeeService.delete(id);
            alert('Çalışan silindi');
            loadData();
        } catch (error) {
            alert('Hata: ' + (error.response?.data?.message || error.message));
        }
    };

    const resetForm = () => {
        setFormData({
            first_name: '',
            last_name: '',
            position: '',
            contact_info: '',
            hire_date: '',
            status: 'active'
        });
        setEditingId(null);
        setShowForm(false);
    };

    if (loading) return <Layout><div className="loading">Yükleniyor...</div></Layout>;

    return (
        <Layout>
            <div className="page">
                <div className="page-header">
                    <h1>Çalışanlar</h1>
                    <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                        {showForm ? 'İptal' : '+ Yeni Çalışan'}
                    </button>
                </div>

                {showForm && (
                    <div className="form-card">
                        <h2>{editingId ? 'Çalışan Düzenle' : 'Yeni Çalışan Ekle'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Ad *</label>
                                    <input 
                                        type="text" 
                                        value={formData.first_name} 
                                        onChange={(e) => setFormData({...formData, first_name: e.target.value})} 
                                        required 
                                        placeholder="Adı"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Soyad *</label>
                                    <input 
                                        type="text" 
                                        value={formData.last_name} 
                                        onChange={(e) => setFormData({...formData, last_name: e.target.value})} 
                                        required 
                                        placeholder="Soyadı"
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Pozisyon</label>
                                    <input 
                                        type="text" 
                                        value={formData.position} 
                                        onChange={(e) => setFormData({...formData, position: e.target.value})} 
                                        placeholder="Örn: Bakıcı, Veteriner, Yönetici"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>İletişim Bilgisi</label>
                                    <input 
                                        type="text" 
                                        value={formData.contact_info} 
                                        onChange={(e) => setFormData({...formData, contact_info: e.target.value})} 
                                        placeholder="Telefon, Email"
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>İşe Alım Tarihi</label>
                                    <input 
                                        type="date" 
                                        value={formData.hire_date} 
                                        onChange={(e) => setFormData({...formData, hire_date: e.target.value})} 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Durum</label>
                                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                                        <option value="active">Aktif</option>
                                        <option value="inactive">Pasif</option>
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
                                <th>Ad Soyad</th>
                                <th>Pozisyon</th>
                                <th>İletişim</th>
                                <th>İşe Alım Tarihi</th>
                                <th>Durum</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(employee => (
                                <tr key={employee.employee_id}>
                                    <td>{employee.employee_id}</td>
                                    <td><strong>{employee.first_name} {employee.last_name}</strong></td>
                                    <td>{employee.position || '-'}</td>
                                    <td>{employee.contact_info || '-'}</td>
                                    <td>{employee.hire_date ? new Date(employee.hire_date).toLocaleDateString('tr-TR') : '-'}</td>
                                    <td><span className={`badge ${employee.status}`}>{employee.status}</span></td>
                                    <td>
                                        <button onClick={() => handleEdit(employee)} className="btn-sm btn-edit">Düzenle</button>
                                        <button onClick={() => handleDelete(employee.employee_id)} className="btn-sm btn-delete">Sil</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {employees.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            Henüz çalışan kaydı yok.
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Employees;
