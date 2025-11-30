import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { healthRecordService, animalService } from '../services';
import '../styles/Common.css';

const HealthRecords = () => {
    const [records, setRecords] = useState([]);
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        animal_id: '',
        date: '',
        diagnosis: '',
        treatment_applied: '',
        medications: '',
        veterinarian_info: '',
        notes: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Sıralı istekler
            const recordsRes = await healthRecordService.getAll();
            setRecords(recordsRes.data.data);

            const animalsRes = await animalService.getAll();
            setAnimals(animalsRes.data.data);
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
                await healthRecordService.update(editingId, formData);
                alert('Sağlık kaydı güncellendi');
            } else {
                await healthRecordService.create(formData);
                alert('Sağlık kaydı eklendi');
            }
            resetForm();
            loadData();
        } catch (error) {
            alert('Hata: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleEdit = (record) => {
        setFormData({
            animal_id: record.animal_id,
            date: record.date ? record.date.split('T')[0] : '',
            diagnosis: record.diagnosis || '',
            treatment_applied: record.treatment_applied || '',
            medications: record.medications || '',
            veterinarian_info: record.veterinarian_info || '',
            notes: record.notes || ''
        });
        setEditingId(record.health_record_id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu sağlık kaydını silmek istediğinize emin misiniz?')) return;
        try {
            await healthRecordService.delete(id);
            alert('Sağlık kaydı silindi');
            loadData();
        } catch (error) {
            alert('Hata: ' + (error.response?.data?.message || error.message));
        }
    };

    const resetForm = () => {
        setFormData({
            animal_id: '',
            date: '',
            diagnosis: '',
            treatment_applied: '',
            medications: '',
            veterinarian_info: '',
            notes: ''
        });
        setEditingId(null);
        setShowForm(false);
    };

    if (loading) return <Layout><div className="loading">Yükleniyor...</div></Layout>;

    return (
        <Layout>
            <div className="page">
                <div className="page-header">
                    <h1>Sağlık Kayıtları</h1>
                    <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                        {showForm ? 'İptal' : '+ Yeni Kayıt'}
                    </button>
                </div>

                {showForm && (
                    <div className="form-card">
                        <h2>{editingId ? 'Sağlık Kaydı Düzenle' : 'Yeni Sağlık Kaydı Ekle'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Hayvan *</label>
                                    <select value={formData.animal_id} onChange={(e) => setFormData({ ...formData, animal_id: e.target.value })} required>
                                        <option value="">Seçin</option>
                                        {animals.map(animal => (
                                            <option key={animal.animal_id} value={animal.animal_id}>
                                                {animal.tag_number || `ID: ${animal.animal_id}`} - {animal.species} ({animal.breed})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Tarih *</label>
                                    <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Teşhis</label>
                                <input type="text" value={formData.diagnosis} onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })} placeholder="Hastalık veya durum" />
                            </div>
                            <div className="form-group">
                                <label>Uygulanan Tedavi</label>
                                <textarea value={formData.treatment_applied} onChange={(e) => setFormData({ ...formData, treatment_applied: e.target.value })} placeholder="Yapılan tedavi detayları"></textarea>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>İlaçlar</label>
                                    <input type="text" value={formData.medications} onChange={(e) => setFormData({ ...formData, medications: e.target.value })} placeholder="Kullanılan ilaçlar" />
                                </div>
                                <div className="form-group">
                                    <label>Veteriner Bilgisi</label>
                                    <input type="text" value={formData.veterinarian_info} onChange={(e) => setFormData({ ...formData, veterinarian_info: e.target.value })} placeholder="Dr. Adı" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Notlar</label>
                                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Ek notlar"></textarea>
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
                                <th>Hayvan</th>
                                <th>Tarih</th>
                                <th>Teşhis</th>
                                <th>Tedavi</th>
                                <th>İlaçlar</th>
                                <th>Veteriner</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map(record => (
                                <tr key={record.health_record_id}>
                                    <td>{record.health_record_id}</td>
                                    <td>{record.tag_number || `ID: ${record.animal_id}`}</td>
                                    <td>{new Date(record.date).toLocaleDateString('tr-TR')}</td>
                                    <td>{record.diagnosis || '-'}</td>
                                    <td>{record.treatment_applied ? record.treatment_applied.substring(0, 30) + '...' : '-'}</td>
                                    <td>{record.medications || '-'}</td>
                                    <td>{record.veterinarian_info || '-'}</td>
                                    <td>
                                        <button onClick={() => handleEdit(record)} className="btn-sm btn-edit">Düzenle</button>
                                        <button onClick={() => handleDelete(record.health_record_id)} className="btn-sm btn-delete">Sil</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {records.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            Henüz sağlık kaydı yok.
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default HealthRecords;
