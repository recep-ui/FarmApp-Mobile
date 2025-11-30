const db = require('../config/database');

// Tüm çalışanları listele
exports.getAllEmployees = async (req, res) => {
    try {
        const { status, position } = req.query;

        let query = 'SELECT * FROM employees WHERE 1=1';
        const params = [];

        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }
        if (position) {
            query += ' AND position LIKE ?';
            params.push(`%${position}%`);
        }

        query += ' ORDER BY employee_id DESC';

        const [employees] = await db.query(query, params);

        res.json({
            success: true,
            count: employees.length,
            data: employees
        });
    } catch (error) {
        console.error('Get all employees error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// ID'ye göre çalışan getir
exports.getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;

        const [employees] = await db.query(
            'SELECT * FROM employees WHERE employee_id = ?',
            [id]
        );

        if (employees.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Çalışan bulunamadı'
            });
        }

        // Çalışanın görevlerini de getir
        const [tasks] = await db.query(
            'SELECT * FROM tasks WHERE assigned_employee_id = ? ORDER BY due_date DESC',
            [id]
        );

        res.json({
            success: true,
            data: {
                ...employees[0],
                tasks: tasks
            }
        });
    } catch (error) {
        console.error('Get employee by id error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Yeni çalışan ekle
exports.createEmployee = async (req, res) => {
    try {
        const { first_name, last_name, position, contact_info, hire_date, status } = req.body;

        const [result] = await db.query(
            `INSERT INTO employees 
             (first_name, last_name, position, contact_info, hire_date, status)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [first_name, last_name, position, contact_info, hire_date, status || 'active']
        );

        res.status(201).json({
            success: true,
            message: 'Çalışan başarıyla eklendi',
            data: {
                employee_id: result.insertId
            }
        });
    } catch (error) {
        console.error('Create employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Çalışan güncelle
exports.updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, position, contact_info, hire_date, status } = req.body;

        const [existing] = await db.query(
            'SELECT employee_id FROM employees WHERE employee_id = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Çalışan bulunamadı'
            });
        }

        await db.query(
            `UPDATE employees SET 
             first_name = ?, last_name = ?, position = ?, contact_info = ?, hire_date = ?, status = ?
             WHERE employee_id = ?`,
            [first_name, last_name, position, contact_info, hire_date, status, id]
        );

        res.json({
            success: true,
            message: 'Çalışan başarıyla güncellendi'
        });
    } catch (error) {
        console.error('Update employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Çalışan sil
exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        // Çalışana atanmış görev var mı kontrol et
        const [tasks] = await db.query(
            'SELECT COUNT(*) as count FROM tasks WHERE assigned_employee_id = ? AND status != "completed"',
            [id]
        );

        if (tasks[0].count > 0) {
            return res.status(400).json({
                success: false,
                message: `Bu çalışanın ${tasks[0].count} tamamlanmamış görevi var. Önce görevleri tamamlayın veya başkasına atayın.`
            });
        }

        const [result] = await db.query(
            'DELETE FROM Employees WHERE employee_id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Çalışan bulunamadı'
            });
        }

        res.json({
            success: true,
            message: 'Çalışan başarıyla silindi'
        });
    } catch (error) {
        console.error('Delete employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};
