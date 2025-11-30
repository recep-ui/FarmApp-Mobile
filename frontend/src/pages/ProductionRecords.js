import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { productionRecordService, animalService } from '../services';
import '../styles/Common.css';

const ProductionRecords = () => {
    const [records, setRecords] = useState([]);
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        animal_id: '',
        date: '',
        product_type: '',
        quantity: '',
        unit: '',
        quality: '',
        notes: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Sıralı istekler yaparak DB connection limitini aşmıyoruz
            const recordsRes = await productionRecordService.getAll();
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
                await productionRecordService.update(editingId, formData);
                alert('Üretim kaydı güncellendi');
            } else {
                await productionRecordService.create(formData);
                alert('Üretim kaydı eklendi');
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
            product_type: record.product_type,
            quantity: record.quantity,
            unit: record.unit,
            quality: record.quality || '',
            notes: record.notes || ''
        });
        setEditingId(record.production_record_id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu üretim kaydını silmek istediğinize emin misiniz?')) return;
        try {
            await productionRecordService.delete(id);
            alert('Üretim kaydı silindi');
            loadData();
        } catch (error) {
            alert('Hata: ' + (error.response?.data?.message || error.message));
        }
    };

    const resetForm = () => {
        setFormData({
            animal_id: '',
            date: '',
            product_type: '',
            quantity: '',
            unit: '',
            quality: '',
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
                    <h1>Üretim Kayıtları</h1>
                    <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                        {showForm ? 'İptal' : '+ Yeni Kayıt'}
                    </button>
                </div>

                {showForm && (
                    <div className="form-card">
                        <h2>{editingId ? 'Üretim Kaydı Düzenle' : 'Yeni Üretim Kaydı Ekle'}</h2>
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
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Ürün Türü *</label>
                                    <select value={formData.product_type} onChange={(e) => setFormData({ ...formData, product_type: e.target.value })} required>
                                        <option value="">Seçin</option>
                                        <option value="Milk">Süt</option>
                                        <option value="Egg">Yumurta</option>
                                        <option value="Wool">Yün</option>
                                        <option value="Meat">Et</option>
                                        <option value="Other">Diğer</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Kalite</label>
                                    <select value={formData.quality} onChange={(e) => setFormData({ ...formData, quality: e.target.value })}>
                                        <option value="">Seçin</option>
                                        <option value="A">A Kalite</option>
                                        <option value="B">B Kalite</option>
                                        <option value="C">C Kalite</option>
                                    </select>
                                </div>
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
                                        <option value="litre">Litre</option>
                                        <option value="kg">Kilogram (kg)</option>
                                        <option value="adet">Adet</option>
                                        <option value="ton">Ton</option>
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
                                <th>Ürün Türü</th>
                                <th>Miktar</th>
                                <th>Kalite</th>
                                <th>Notlar</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map(record => (
                                <tr key={record.production_record_id}>
                                    <td>{record.production_record_id}</td>
                                    <td>{record.tag_number || `ID: ${record.animal_id}`}</td>
                                    <td>{new Date(record.date).toLocaleDateString('tr-TR')}</td>
                                    <td><strong>{record.product_type}</strong></td>
                                    <td>{record.quantity} {record.unit}</td>
                                    <td>
                                        {record.quality && <span className="badge active">{record.quality}</span>}
                                        {!record.quality && '-'}
                                    </td>
                                    <td>{record.notes ? record.notes.substring(0, 25) + '...' : '-'}</td>
                                    <td>
                                        <button onClick={() => handleEdit(record)} className="btn-sm btn-edit">Düzenle</button>
                                        <button onClick={() => handleDelete(record.production_record_id)} className="btn-sm btn-delete">Sil</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {records.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            Henüz üretim kaydı yok.
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ProductionRecords;
