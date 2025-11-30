import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { barnService } from '../services';
import '../styles/Common.css';

const Barns = () => {
    const [barns, setBarns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        capacity: '',
        location: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const response = await barnService.getAll();
            setBarns(response.data.data);
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
                await barnService.update(editingId, formData);
                alert('Ahır güncellendi');
            } else {
                await barnService.create(formData);
                alert('Ahır eklendi');
            }
            resetForm();
            loadData();
        } catch (error) {
            alert('Hata: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleEdit = (barn) => {
        setFormData({
            name: barn.name,
            capacity: barn.capacity,
            location: barn.location || ''
        });
        setEditingId(barn.barn_id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu ahırı silmek istediğinize emin misiniz?')) return;
        try {
            await barnService.delete(id);
            alert('Ahır silindi');
            loadData();
        } catch (error) {
            alert('Hata: ' + (error.response?.data?.message || error.message));
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            capacity: '',
            location: ''
        });
        setEditingId(null);
        setShowForm(false);
    };

    if (loading) return <Layout><div className="loading">Yükleniyor...</div></Layout>;

    return (
        <Layout>
            <div className="page">
                <div className="page-header">
                    <h1>Ahırlar</h1>
                    <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                        {showForm ? 'İptal' : '+ Yeni Ahır'}
                    </button>
                </div>

                {showForm && (
                    <div className="form-card">
                        <h2>{editingId ? 'Ahır Düzenle' : 'Yeni Ahır Ekle'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Ahır Adı *</label>
                                <input 
                                    type="text" 
                                    value={formData.name} 
                                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                    required 
                                    placeholder="Örn: A Blok Ahırı"
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Kapasite *</label>
                                    <input 
                                        type="number" 
                                        min="1"
                                        value={formData.capacity} 
                                        onChange={(e) => setFormData({...formData, capacity: e.target.value})} 
                                        required 
                                        placeholder="Maksimum hayvan sayısı"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Konum</label>
                                    <input 
                                        type="text" 
                                        value={formData.location} 
                                        onChange={(e) => setFormData({...formData, location: e.target.value})} 
                                        placeholder="Örn: Kuzey Bölge"
                                    />
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
                                <th>Ahır Adı</th>
                                <th>Kapasite</th>
                                <th>Doluluk</th>
                                <th>Boş Alan</th>
                                <th>Konum</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {barns.map(barn => (
                                <tr key={barn.barn_id}>
                                    <td>{barn.barn_id}</td>
                                    <td><strong>{barn.name}</strong></td>
                                    <td>{barn.capacity}</td>
                                    <td>
                                        <span className={barn.current_occupancy >= barn.capacity ? 'badge inactive' : 'badge active'}>
                                            {barn.current_occupancy || 0}
                                        </span>
                                    </td>
                                    <td>{barn.available_space || barn.capacity}</td>
                                    <td>{barn.location || '-'}</td>
                                    <td>
                                        <button onClick={() => handleEdit(barn)} className="btn-sm btn-edit">Düzenle</button>
                                        <button onClick={() => handleDelete(barn.barn_id)} className="btn-sm btn-delete">Sil</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {barns.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            Henüz ahır kaydı yok. Yeni ahır ekleyerek başlayın.
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Barns;
