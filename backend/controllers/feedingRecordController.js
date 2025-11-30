const db = require('../config/database');

// Tüm besleme kayıtlarını listele
exports.getAllFeedingRecords = async (req, res) => {
    try {
        const { animal_id, start_date, end_date, feed_type } = req.query;

        let query = `
            SELECT fr.*, a.tag_number, a.species, a.breed
            FROM feeding_records fr
            JOIN animals a ON fr.animal_id = a.animal_id
            WHERE 1=1
        `;
        const params = [];

        if (animal_id) {
            query += ' AND fr.animal_id = ?';
            params.push(animal_id);
        }
        if (start_date) {
            query += ' AND fr.date >= ?';
            params.push(start_date);
        }
        if (end_date) {
            query += ' AND fr.date <= ?';
            params.push(end_date);
        }
        if (feed_type) {
            query += ' AND fr.feed_type LIKE ?';
            params.push(`%${feed_type}%`);
        }

        query += ' ORDER BY fr.date DESC, fr.feeding_record_id DESC';

        const [records] = await db.query(query, params);

        res.json({
            success: true,
            count: records.length,
            data: records
        });
    } catch (error) {
        console.error('Get all feeding records error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// ID'ye göre besleme kaydı getir
exports.getFeedingRecordById = async (req, res) => {
    try {
        const { id } = req.params;

        const [records] = await db.query(
            `SELECT fr.*, a.tag_number, a.species, a.breed
             FROM feeding_records fr
             JOIN animals a ON fr.animal_id = a.animal_id
             WHERE fr.feeding_record_id = ?`,
            [id]
        );

        if (records.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Besleme kaydı bulunamadı'
            });
        }

        res.json({
            success: true,
            data: records[0]
        });
    } catch (error) {
        console.error('Get feeding record by id error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Yeni besleme kaydı ekle
exports.createFeedingRecord = async (req, res) => {
    try {
        const { animal_id, date, feed_type, quantity, unit, notes } = req.body;

        const [animal] = await db.query('SELECT animal_id FROM animals WHERE animal_id = ?', [animal_id]);
        if (animal.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Hayvan bulunamadı'
            });
        }

        const [result] = await db.query(
            `INSERT INTO feeding_records 
             (animal_id, date, feed_type, quantity, unit, notes)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [animal_id, date, feed_type, quantity, unit, notes]
        );

        res.status(201).json({
            success: true,
            message: 'Besleme kaydı başarıyla eklendi',
            data: {
                feeding_record_id: result.insertId
            }
        });
    } catch (error) {
        console.error('Create feeding record error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Besleme kaydı güncelle
exports.updateFeedingRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const { animal_id, date, feed_type, quantity, unit, notes } = req.body;

        const [existing] = await db.query(
            'SELECT feeding_record_id FROM feeding_records WHERE feeding_record_id = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Besleme kaydı bulunamadı'
            });
        }

        await db.query(
            `UPDATE feeding_records SET 
             animal_id = ?, date = ?, feed_type = ?, quantity = ?, unit = ?, notes = ?
             WHERE feeding_record_id = ?`,
            [animal_id, date, feed_type, quantity, unit, notes, id]
        );

        res.json({
            success: true,
            message: 'Besleme kaydı başarıyla güncellendi'
        });
    } catch (error) {
        console.error('Update feeding record error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Besleme kaydı sil
exports.deleteFeedingRecord = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            'DELETE FROM feeding_records WHERE feeding_record_id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Besleme kaydı bulunamadı'
            });
        }

        res.json({
            success: true,
            message: 'Besleme kaydı başarıyla silindi'
        });
    } catch (error) {
        console.error('Delete feeding record error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};
