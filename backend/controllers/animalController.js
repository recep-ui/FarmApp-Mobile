const db = require('../config/database');

// Tüm hayvanları listele
exports.getAllAnimals = async (req, res) => {
    try {
        const { species, barn_id, status } = req.query;

        let query = `
            SELECT a.*, b.name as barn_name 
            FROM animals a 
            LEFT JOIN barns b ON a.barn_id = b.barn_id
            WHERE 1=1
        `;
        const params = [];

        if (species) {
            query += ' AND a.species = ?';
            params.push(species);
        }
        if (barn_id) {
            query += ' AND a.barn_id = ?';
            params.push(barn_id);
        }
        if (status) {
            query += ' AND a.status = ?';
            params.push(status);
        }

        query += ' ORDER BY a.animal_id DESC';

        const [animals] = await db.query(query, params);

        res.json({
            success: true,
            count: animals.length,
            data: animals
        });
    } catch (error) {
        console.error('Get all animals error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// ID'ye göre hayvan getir
exports.getAnimalById = async (req, res) => {
    try {
        const { id } = req.params;

        const [animals] = await db.query(
            `SELECT a.*, 
                    b.name as barn_name,
                    m.tag_number as mother_tag,
                    f.tag_number as father_tag
             FROM animals a
             LEFT JOIN barns b ON a.barn_id = b.barn_id
             LEFT JOIN animals m ON a.mother_id = m.animal_id
             LEFT JOIN animals f ON a.father_id = f.animal_id
             WHERE a.animal_id = ?`,
            [id]
        );

        if (animals.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Hayvan bulunamadı'
            });
        }

        res.json({
            success: true,
            data: animals[0]
        });
    } catch (error) {
        console.error('Get animal by id error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Yeni hayvan ekle
exports.createAnimal = async (req, res) => {
    try {
        const {
            species, breed, birth_date, gender, tag_number,
            mother_id, father_id, barn_id, status
        } = req.body;

        // Tag number benzersiz olmalı
        if (tag_number) {
            const [existing] = await db.query(
                'SELECT animal_id FROM animals WHERE tag_number = ?',
                [tag_number]
            );
            if (existing.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Bu kulak numarası zaten kullanılıyor'
                });
            }
        }

        const [result] = await db.query(
            `INSERT INTO animals 
             (species, breed, birth_date, gender, tag_number, mother_id, father_id, barn_id, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [species, breed, birth_date, gender, tag_number, mother_id, father_id, barn_id, status || 'active']
        );

        res.status(201).json({
            success: true,
            message: 'Hayvan başarıyla eklendi',
            data: {
                animal_id: result.insertId
            }
        });
    } catch (error) {
        console.error('Create animal error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Hayvan güncelle
exports.updateAnimal = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            species, breed, birth_date, gender, tag_number,
            mother_id, father_id, barn_id, total_production, status
        } = req.body;

        // Hayvan var mı kontrol et
        const [existing] = await db.query(
            'SELECT animal_id FROM animals WHERE animal_id = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Hayvan bulunamadı'
            });
        }

        // Tag number benzersiz olmalı (kendisi hariç)
        if (tag_number) {
            const [duplicate] = await db.query(
                'SELECT animal_id FROM animals WHERE tag_number = ? AND animal_id != ?',
                [tag_number, id]
            );
            if (duplicate.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Bu kulak numarası zaten kullanılıyor'
                });
            }
        }

        await db.query(
            `UPDATE animals SET 
             species = ?, breed = ?, birth_date = ?, gender = ?, tag_number = ?,
             mother_id = ?, father_id = ?, barn_id = ?, total_production = ?, status = ?
             WHERE animal_id = ?`,
            [species, breed, birth_date, gender, tag_number, mother_id, father_id,
                barn_id, total_production, status, id]
        );

        res.json({
            success: true,
            message: 'Hayvan başarıyla güncellendi'
        });
    } catch (error) {
        console.error('Update animal error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Hayvan sil
exports.deleteAnimal = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            'DELETE FROM animals WHERE animal_id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Hayvan bulunamadı'
            });
        }

        res.json({
            success: true,
            message: 'Hayvan başarıyla silindi'
        });
    } catch (error) {
        console.error('Delete animal error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Hayvan istatistikleri
exports.getAnimalStats = async (req, res) => {
    try {
        const [stats] = await db.query(`
            SELECT 
                COUNT(*) as total_animals,
                COUNT(CASE WHEN species = 'Cow' THEN 1 END) as total_cows,
                COUNT(CASE WHEN species = 'Sheep' THEN 1 END) as total_sheep,
                COUNT(CASE WHEN species = 'Chicken' THEN 1 END) as total_chickens,
                COUNT(CASE WHEN status = 'active' THEN 1 END) as active_animals,
                SUM(total_production) as total_production
            FROM animals
        `);

        res.json({
            success: true,
            data: stats[0]
        });
    } catch (error) {
        console.error('Get animal stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};
