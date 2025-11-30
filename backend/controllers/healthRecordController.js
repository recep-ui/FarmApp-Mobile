const db = require('../config/database');

// Tüm sağlık kayıtlarını listele
exports.getAllHealthRecords = async (req, res) => {
    try {
        const { animal_id, start_date, end_date } = req.query;

        let query = `
            SELECT hr.*, a.tag_number, a.species, a.breed
            FROM health_records hr
            JOIN animals a ON hr.animal_id = a.animal_id
            WHERE 1=1
        `;
        const params = [];

        if (animal_id) {
            query += ' AND hr.animal_id = ?';
            params.push(animal_id);
        }
        if (start_date) {
            query += ' AND hr.date >= ?';
            params.push(start_date);
        }
        if (end_date) {
            query += ' AND hr.date <= ?';
            params.push(end_date);
        }

        query += ' ORDER BY hr.date DESC, hr.health_record_id DESC';

        const [records] = await db.query(query, params);

        res.json({
            success: true,
            count: records.length,
            data: records
        });
    } catch (error) {
        console.error('Get all health records error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// ID'ye göre sağlık kaydı getir
exports.getHealthRecordById = async (req, res) => {
    try {
        const { id } = req.params;

        const [records] = await db.query(
            `SELECT hr.*, a.tag_number, a.species, a.breed
             FROM health_records hr
             JOIN animals a ON hr.animal_id = a.animal_id
             WHERE hr.health_record_id = ?`,
            [id]
        );

        if (records.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Sağlık kaydı bulunamadı'
            });
        }

        res.json({
            success: true,
            data: records[0]
        });
    } catch (error) {
        console.error('Get health record by id error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Yeni sağlık kaydı ekle
exports.createHealthRecord = async (req, res) => {
    try {
        const { animal_id, date, diagnosis, treatment_applied, medications, veterinarian_info, notes } = req.body;

        // Hayvan var mı kontrol et
        const [animal] = await db.query('SELECT animal_id FROM animals WHERE animal_id = ?', [animal_id]);
        if (animal.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Hayvan bulunamadı'
            });
        }

        const [result] = await db.query(
            `INSERT INTO health_records 
             (animal_id, date, diagnosis, treatment_applied, medications, veterinarian_info, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [animal_id, date, diagnosis, treatment_applied, medications, veterinarian_info, notes]
        );

        res.status(201).json({
            success: true,
            message: 'Sağlık kaydı başarıyla eklendi',
            data: {
                health_record_id: result.insertId
            }
        });
    } catch (error) {
        console.error('Create health record error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Sağlık kaydı güncelle
exports.updateHealthRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const { animal_id, date, diagnosis, treatment_applied, medications, veterinarian_info, notes } = req.body;

        const [existing] = await db.query(
            'SELECT health_record_id FROM health_records WHERE health_record_id = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Sağlık kaydı bulunamadı'
            });
        }

        await db.query(
            `UPDATE health_records SET 
             animal_id = ?, date = ?, diagnosis = ?, treatment_applied = ?, 
             medications = ?, veterinarian_info = ?, notes = ?
             WHERE health_record_id = ?`,
            [animal_id, date, diagnosis, treatment_applied, medications, veterinarian_info, notes, id]
        );

        res.json({
            success: true,
            message: 'Sağlık kaydı başarıyla güncellendi'
        });
    } catch (error) {
        console.error('Update health record error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Sağlık kaydı sil
exports.deleteHealthRecord = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            'DELETE FROM health_records WHERE health_record_id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Sağlık kaydı bulunamadı'
            });
        }

        res.json({
            success: true,
            message: 'Sağlık kaydı başarıyla silindi'
        });
    } catch (error) {
        console.error('Delete health record error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};
