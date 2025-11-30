const db = require('../config/database');

// Tüm üretim kayıtlarını listele
exports.getAllProductionRecords = async (req, res) => {
    try {
        const { animal_id, start_date, end_date, product_type } = req.query;

        let query = `
            SELECT pr.*, a.tag_number, a.species, a.breed
            FROM production_records pr
            JOIN animals a ON pr.animal_id = a.animal_id
            WHERE 1=1
        `;
        const params = [];

        if (animal_id) {
            query += ' AND pr.animal_id = ?';
            params.push(animal_id);
        }
        if (start_date) {
            query += ' AND pr.date >= ?';
            params.push(start_date);
        }
        if (end_date) {
            query += ' AND pr.date <= ?';
            params.push(end_date);
        }
        if (product_type) {
            query += ' AND pr.product_type LIKE ?';
            params.push(`%${product_type}%`);
        }

        query += ' ORDER BY pr.date DESC, pr.production_record_id DESC';

        const [records] = await db.query(query, params);

        res.json({
            success: true,
            count: records.length,
            data: records
        });
    } catch (error) {
        console.error('Get all production records error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// ID'ye göre üretim kaydı getir
exports.getProductionRecordById = async (req, res) => {
    try {
        const { id } = req.params;

        const [records] = await db.query(
            `SELECT pr.*, a.tag_number, a.species, a.breed
             FROM production_records pr
             JOIN animals a ON pr.animal_id = a.animal_id
             WHERE pr.production_record_id = ?`,
            [id]
        );

        if (records.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Üretim kaydı bulunamadı'
            });
        }

        res.json({
            success: true,
            data: records[0]
        });
    } catch (error) {
        console.error('Get production record by id error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Yeni üretim kaydı ekle
exports.createProductionRecord = async (req, res) => {
    try {
        const { animal_id, date, product_type, quantity, unit, quality, notes } = req.body;

        const [animal] = await db.query('SELECT animal_id FROM animals WHERE animal_id = ?', [animal_id]);
        if (animal.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Hayvan bulunamadı'
            });
        }

        const [result] = await db.query(
            `INSERT INTO production_records 
             (animal_id, date, product_type, quantity, unit, quality, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [animal_id, date, product_type, quantity, unit, quality, notes]
        );

        // Hayvanın toplam üretimini güncelle
        await db.query(
            `UPDATE animals 
             SET total_production = total_production + ?
             WHERE animal_id = ?`,
            [quantity, animal_id]
        );

        res.status(201).json({
            success: true,
            message: 'Üretim kaydı başarıyla eklendi',
            data: {
                production_record_id: result.insertId
            }
        });
    } catch (error) {
        console.error('Create production record error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Üretim kaydı güncelle
exports.updateProductionRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const { animal_id, date, product_type, quantity, unit, quality, notes } = req.body;

        // Eski kaydı al
        const [oldRecord] = await db.query(
            'SELECT animal_id, quantity FROM production_records WHERE production_record_id = ?',
            [id]
        );

        if (oldRecord.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Üretim kaydı bulunamadı'
            });
        }

        // Kaydı güncelle
        await db.query(
            `UPDATE production_records SET 
             animal_id = ?, date = ?, product_type = ?, quantity = ?, unit = ?, quality = ?, notes = ?
             WHERE production_record_id = ?`,
            [animal_id, date, product_type, quantity, unit, quality, notes, id]
        );

        // Eski hayvanın toplam üretiminden çıkar
        await db.query(
            `UPDATE animals 
             SET total_production = total_production - ?
             WHERE animal_id = ?`,
            [oldRecord[0].quantity, oldRecord[0].animal_id]
        );

        // Yeni hayvanın toplam üretimine ekle
        await db.query(
            `UPDATE animals 
             SET total_production = total_production + ?
             WHERE animal_id = ?`,
            [quantity, animal_id]
        );

        res.json({
            success: true,
            message: 'Üretim kaydı başarıyla güncellendi'
        });
    } catch (error) {
        console.error('Update production record error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Üretim kaydı sil
exports.deleteProductionRecord = async (req, res) => {
    try {
        const { id } = req.params;

        // Kaydı al
        const [record] = await db.query(
            'SELECT animal_id, quantity FROM production_records WHERE production_record_id = ?',
            [id]
        );

        if (record.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Üretim kaydı bulunamadı'
            });
        }

        // Kaydı sil
        await db.query(
            'DELETE FROM production_records WHERE production_record_id = ?',
            [id]
        );

        // Hayvanın toplam üretiminden çıkar
        await db.query(
            `UPDATE animals 
             SET total_production = total_production - ?
             WHERE animal_id = ?`,
            [record[0].quantity, record[0].animal_id]
        );

        res.json({
            success: true,
            message: 'Üretim kaydı başarıyla silindi'
        });
    } catch (error) {
        console.error('Delete production record error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Üretim istatistikleri
exports.getProductionStats = async (req, res) => {
    try {
        const { start_date, end_date, product_type } = req.query;

        let query = `
            SELECT 
                product_type,
                SUM(quantity) as total_quantity,
                AVG(quantity) as avg_quantity,
                COUNT(*) as record_count,
                unit
            FROM production_records
            WHERE 1=1
        `;
        const params = [];

        if (start_date) {
            query += ' AND date >= ?';
            params.push(start_date);
        }
        if (end_date) {
            query += ' AND date <= ?';
            params.push(end_date);
        }
        if (product_type) {
            query += ' AND product_type = ?';
            params.push(product_type);
        }

        query += ' GROUP BY product_type, unit';

        const [stats] = await db.query(query, params);

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Get production stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};
