const db = require('../config/database');

// Tüm görevleri listele
exports.getAllTasks = async (req, res) => {
    try {
        const { status, assigned_employee_id, priority } = req.query;

        let query = `
            SELECT t.*, 
                   CONCAT(e.first_name, ' ', e.last_name) as employee_name
            FROM tasks t
            LEFT JOIN employees e ON t.assigned_employee_id = e.employee_id
            WHERE 1=1
        `;
        const params = [];

        if (status) {
            query += ' AND t.status = ?';
            params.push(status);
        }
        if (assigned_employee_id) {
            query += ' AND t.assigned_employee_id = ?';
            params.push(assigned_employee_id);
        }
        if (priority) {
            query += ' AND t.priority = ?';
            params.push(priority);
        }

        query += ' ORDER BY t.due_date ASC, t.priority DESC, t.task_id DESC';

        const [tasks] = await db.query(query, params);

        res.json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        console.error('Get all tasks error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// ID'ye göre görev getir
exports.getTaskById = async (req, res) => {
    try {
        const { id } = req.params;

        const [tasks] = await db.query(
            `SELECT t.*, 
                    CONCAT(e.first_name, ' ', e.last_name) as employee_name,
                    e.position as employee_position
             FROM tasks t
             LEFT JOIN employees e ON t.assigned_employee_id = e.employee_id
             WHERE t.task_id = ?`,
            [id]
        );

        if (tasks.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Görev bulunamadı'
            });
        }

        res.json({
            success: true,
            data: tasks[0]
        });
    } catch (error) {
        console.error('Get task by id error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Yeni görev ekle
exports.createTask = async (req, res) => {
    try {
        const { title, description, assigned_employee_id, due_date, status, priority } = req.body;

        // Çalışan var mı kontrol et (eğer atanmışsa)
        if (assigned_employee_id) {
            const [employee] = await db.query(
                'SELECT employee_id FROM employees WHERE employee_id = ? AND status = "active"',
                [assigned_employee_id]
            );
            if (employee.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Geçerli bir çalışan bulunamadı'
                });
            }
        }

        const [result] = await db.query(
            `INSERT INTO tasks 
             (title, description, assigned_employee_id, due_date, status, priority)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [title, description, assigned_employee_id, due_date, status || 'pending', priority || 'medium']
        );

        res.status(201).json({
            success: true,
            message: 'Görev başarıyla eklendi',
            data: {
                task_id: result.insertId
            }
        });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Görev güncelle
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, assigned_employee_id, due_date, status, priority } = req.body;

        const [existing] = await db.query(
            'SELECT * FROM tasks WHERE task_id = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Görev bulunamadı'
            });
        }

        // Eğer durum "completed" olarak değiştirildiyse, completed_date'i güncelle
        let completed_date = existing[0].completed_date;
        if (status === 'completed' && existing[0].status !== 'completed') {
            completed_date = new Date();
        } else if (status !== 'completed') {
            completed_date = null;
        }

        await db.query(
            `UPDATE tasks SET 
             title = ?, description = ?, assigned_employee_id = ?, due_date = ?, 
             status = ?, priority = ?, completed_date = ?
             WHERE task_id = ?`,
            [title, description, assigned_employee_id, due_date, status, priority, completed_date, id]
        );

        res.json({
            success: true,
            message: 'Görev başarıyla güncellendi'
        });
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Görev sil
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            'DELETE FROM tasks WHERE task_id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Görev bulunamadı'
            });
        }

        res.json({
            success: true,
            message: 'Görev başarıyla silindi'
        });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Görev istatistikleri
exports.getTaskStats = async (req, res) => {
    try {
        const [stats] = await db.query(`
            SELECT 
                COUNT(*) as total_tasks,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_tasks,
                COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tasks,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
                COUNT(CASE WHEN due_date < CURDATE() AND status != 'completed' THEN 1 END) as overdue_tasks
            FROM tasks
        `);

        res.json({
            success: true,
            data: stats[0]
        });
    } catch (error) {
        console.error('Get task stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};
