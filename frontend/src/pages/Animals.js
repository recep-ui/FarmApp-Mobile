import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { animalService, barnService } from '../services';
import '../styles/Common.css';

const Animals = () => {
    const [animals, setAnimals] = useState([]);
    const [barns, setBarns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        species: '',
        breed: '',
        birth_date: '',
        gender: '',
        tag_number: '',
        barn_id: '',
        status: 'active'
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Sıralı istekler
            const animalsRes = await animalService.getAll();
            setAnimals(animalsRes.data.data);

            const barnsRes = await barnService.getAll();
            setBarns(barnsRes.data.data);
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
                await animalService.update(editingId, formData);
                alert('Hayvan güncellendi');
            } else {
                await animalService.create(formData);
                alert('Hayvan eklendi');
            }
            resetForm();
            loadData();
        } catch (error) {
            alert('Hata: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleEdit = (animal) => {
        setFormData({
            species: animal.species,
            breed: animal.breed || '',
            birth_date: animal.birth_date ? animal.birth_date.split('T')[0] : '',
            gender: animal.gender || '',
            tag_number: animal.tag_number || '',
            barn_id: animal.barn_id || '',
            status: animal.status
        });
        setEditingId(animal.animal_id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu hayvanı silmek istediğinize emin misiniz?')) return;
        try {
            await animalService.delete(id);
            alert('Hayvan silindi');
            loadData();
        } catch (error) {
            alert('Hata: ' + (error.response?.data?.message || error.message));
        }
    };

    const resetForm = () => {
        setFormData({
            species: '',
            breed: '',
            birth_date: '',
            gender: '',
            tag_number: '',
            barn_id: '',
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
                    <h1>Hayvanlar</h1>
                    <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                        {showForm ? 'İptal' : '+ Yeni Hayvan'}
                    </button>
                </div>

                {showForm && (
                    <div className="form-card">
                        <h2>{editingId ? 'Hayvan Düzenle' : 'Yeni Hayvan Ekle'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Tür *</label>
                                    <select value={formData.species} onChange={(e) => setFormData({ ...formData, species: e.target.value })} required>
                                        <option value="">Seçin</option>
                                        <option value="Cow">İnek</option>
                                        <option value="Sheep">Koyun</option>
                                        <option value="Chicken">Tavuk</option>
                                        <option value="Goat">Keçi</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Irk</label>
                                    <input type="text" value={formData.breed} onChange={(e) => setFormData({ ...formData, breed: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Doğum Tarihi</label>
                                    <input type="date" value={formData.birth_date} onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Cinsiyet</label>
                                    <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                                        <option value="">Seçin</option>
                                        <option value="Male">Erkek</option>
                                        <option value="Female">Dişi</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Kulak Numarası</label>
                                    <input type="text" value={formData.tag_number} onChange={(e) => setFormData({ ...formData, tag_number: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Ahır</label>
                                    <select value={formData.barn_id} onChange={(e) => setFormData({ ...formData, barn_id: e.target.value })}>
                                        <option value="">Seçin</option>
                                        {barns.map(barn => <option key={barn.barn_id} value={barn.barn_id}>{barn.name}</option>)}
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
                                <th>Kulak No</th>
                                <th>Tür</th>
                                <th>Irk</th>
                                <th>Cinsiyet</th>
                                <th>Doğum Tarihi</th>
                                <th>Ahır</th>
                                <th>Durum</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {animals.map(animal => (
                                <tr key={animal.animal_id}>
                                    <td>{animal.animal_id}</td>
                                    <td>{animal.tag_number || '-'}</td>
                                    <td>{animal.species}</td>
                                    <td>{animal.breed || '-'}</td>
                                    <td>{animal.gender || '-'}</td>
                                    <td>{animal.birth_date ? new Date(animal.birth_date).toLocaleDateString('tr-TR') : '-'}</td>
                                    <td>{animal.barn_name || '-'}</td>
                                    <td><span className={`badge ${animal.status}`}>{animal.status}</span></td>
                                    <td>
                                        <button onClick={() => handleEdit(animal)} className="btn-sm btn-edit">Düzenle</button>
                                        <button onClick={() => handleDelete(animal.animal_id)} className="btn-sm btn-delete">Sil</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default Animals;
