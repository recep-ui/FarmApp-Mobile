import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { feedingRecordService, animalService } from '../services';
import '../styles/Common.css';

const FeedingRecords = () => {
    const [records, setRecords] = useState([]);
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        animal_id: '',
        date: '',
        feed_type: '',
        quantity: '',
        unit: '',
        notes: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Sıralı istekler
            const recordsRes = await feedingRecordService.getAll();
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
                await feedingRecordService.update(editingId, formData);
                alert('Besleme kaydı güncellendi');
            } else {
                await feedingRecordService.create(formData);
                alert('Besleme kaydı eklendi');
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
            feed_type: record.feed_type,
            quantity: record.quantity,
            unit: record.unit,
            notes: record.notes || ''
        });
        setEditingId(record.feeding_record_id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu besleme kaydını silmek istediğinize emin misiniz?')) return;
        try {
            await feedingRecordService.delete(id);
            alert('Besleme kaydı silindi');
            loadData();
        } catch (error) {
            alert('Hata: ' + (error.response?.data?.message || error.message));
        }
    };

    const resetForm = () => {
        setFormData({
            animal_id: '',
            date: '',
            feed_type: '',
            quantity: '',
            unit: '',
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
                    <h1>Besleme Kayıtları</h1>
                    <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                        {showForm ? 'İptal' : '+ Yeni Kayıt'}
                    </button>
                </div>

                {showForm && (
                    <div className="form-card">
                        <h2>{editingId ? 'Besleme Kaydı Düzenle' : 'Yeni Besleme Kaydı Ekle'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Hayvan *</label>
                                    <select value={formData.animal_id} onChange={(e) => setFormData({ ...formData, animal_id: e.target.value })} required>
                                        <option value="">Seçin</option>
                                        {animals.map(animal => (
                                            <option key={animal.animal_id} value={animal.animal_id}>
                                                {animal.tag_number || `ID: ${animal.animal_id}`} - {animal.species}
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
                                <label>Yem Türü *</label>
                                <input type="text" value={formData.feed_type} onChange={(e) => setFormData({ ...formData, feed_type: e.target.value })} required placeholder="Örn: Kuru Ot, Tahıl Karışımı" />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Miktar *</label>
                                    <input type="number" step="0.01" min="0" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Birim *</label>
                                    <select value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} required>
                                        <option value="">Seçin</option>
                                        <option value="kg">Kilogram (kg)</option>
                                        <option value="litre">Litre</option>
                                        <option value="ton">Ton</option>
                                        <option value="balya">Balya</option>
                                    </select>
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
                                <th>Yem Türü</th>
                                <th>Miktar</th>
                                <th>Birim</th>
                                <th>Notlar</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map(record => (
                                <tr key={record.feeding_record_id}>
                                    <td>{record.feeding_record_id}</td>
                                    <td>{record.tag_number || `ID: ${record.animal_id}`}</td>
                                    <td>{new Date(record.date).toLocaleDateString('tr-TR')}</td>
                                    <td>{record.feed_type}</td>
                                    <td><strong>{record.quantity}</strong></td>
                                    <td>{record.unit}</td>
                                    <td>{record.notes ? record.notes.substring(0, 30) + '...' : '-'}</td>
                                    <td>
                                        <button onClick={() => handleEdit(record)} className="btn-sm btn-edit">Düzenle</button>
                                        <button onClick={() => handleDelete(record.feeding_record_id)} className="btn-sm btn-delete">Sil</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {records.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            Henüz besleme kaydı yok.
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default FeedingRecords;
