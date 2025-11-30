const db = require('../config/database');

// Tüm ahırları listele
exports.getAllBarns = async (req, res) => {
    try {
        const [barns] = await db.query(`
            SELECT b.*, 
                   COUNT(a.animal_id) as current_occupancy,
                   (b.capacity - COUNT(a.animal_id)) as available_space
            FROM barns b
            LEFT JOIN animals a ON b.barn_id = a.barn_id AND a.status = 'active'
            GROUP BY b.barn_id
            ORDER BY b.barn_id DESC
        `);

        res.json({
            success: true,
            count: barns.length,
            data: barns
        });
    } catch (error) {
        console.error('Get all barns error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// ID'ye göre ahır getir
exports.getBarnById = async (req, res) => {
    try {
        const { id } = req.params;

        const [barns] = await db.query(`
            SELECT b.*, 
                   COUNT(a.animal_id) as current_occupancy,
                   (b.capacity - COUNT(a.animal_id)) as available_space
            FROM barns b
            LEFT JOIN animals a ON b.barn_id = a.barn_id AND a.status = 'active'
            WHERE b.barn_id = ?
            GROUP BY b.barn_id
        `, [id]);

        if (barns.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ahır bulunamadı'
            });
        }

        // Ahırdaki hayvanları da getir
        const [animals] = await db.query(
            'SELECT animal_id, species, breed, tag_number FROM animals WHERE barn_id = ? AND status = "active"',
            [id]
        );

        res.json({
            success: true,
            data: {
                ...barns[0],
                animals: animals
            }
        });
    } catch (error) {
        console.error('Get barn by id error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Yeni ahır ekle
exports.createBarn = async (req, res) => {
    try {
        const { name, capacity, location } = req.body;

        const [result] = await db.query(
            'INSERT INTO barns (name, capacity, location) VALUES (?, ?, ?)',
            [name, capacity, location]
        );

        res.status(201).json({
            success: true,
            message: 'Ahır başarıyla eklendi',
            data: {
                barn_id: result.insertId
            }
        });
    } catch (error) {
        console.error('Create barn error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Ahır güncelle
exports.updateBarn = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, capacity, location } = req.body;

        // Ahır var mı kontrol et
        const [existing] = await db.query(
            'SELECT barn_id FROM barns WHERE barn_id = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ahır bulunamadı'
            });
        }

        // Kapasite kontrolü - mevcut hayvan sayısından az olamaz
        const [occupancy] = await db.query(
            'SELECT COUNT(*) as count FROM animals WHERE barn_id = ? AND status = "active"',
            [id]
        );

        if (capacity < occupancy[0].count) {
            return res.status(400).json({
                success: false,
                message: `Kapasite mevcut hayvan sayısından (${occupancy[0].count}) az olamaz`
            });
        }

        await db.query(
            'UPDATE barns SET name = ?, capacity = ?, location = ? WHERE barn_id = ?',
            [name, capacity, location, id]
        );

        res.json({
            success: true,
            message: 'Ahır başarıyla güncellendi'
        });
    } catch (error) {
        console.error('Update barn error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Ahır sil
exports.deleteBarn = async (req, res) => {
    try {
        const { id } = req.params;

        // Ahırda hayvan var mı kontrol et
        const [animals] = await db.query(
            'SELECT COUNT(*) as count FROM animals WHERE barn_id = ?',
            [id]
        );

        if (animals[0].count > 0) {
            return res.status(400).json({
                success: false,
                message: `Bu ahırda ${animals[0].count} hayvan var. Önce hayvanları başka ahıra taşıyın.`
            });
        }

        const [result] = await db.query(
            'DELETE FROM barns WHERE barn_id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ahır bulunamadı'
            });
        }

        res.json({
            success: true,
            message: 'Ahır başarıyla silindi'
        });
    } catch (error) {
        console.error('Delete barn error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};
