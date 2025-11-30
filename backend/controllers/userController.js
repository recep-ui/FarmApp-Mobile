const db = require('../config/database');
const bcrypt = require('bcrypt');

// Tüm kullanıcıları listele (Sadece Admin)
const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(
            `SELECT user_id, username, email, first_name, last_name, role, is_active, created_at 
             FROM users 
             ORDER BY created_at DESC`
        );

        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Kullanıcı listesi hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Kullanıcılar listelenirken hata oluştu'
        });
    }
};

// Kullanıcı detayı (Sadece Admin)
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const [users] = await db.query(
            `SELECT user_id, username, email, first_name, last_name, role, is_active, created_at 
             FROM users 
             WHERE user_id = ?`,
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        res.json({
            success: true,
            data: users[0]
        });
    } catch (error) {
        console.error('Kullanıcı detay hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Kullanıcı bilgisi alınırken hata oluştu'
        });
    }
};

// Kullanıcı güncelle (Sadece Admin)
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, first_name, last_name, role, is_active } = req.body;

        // Kullanıcının var olup olmadığını kontrol et
        const [existingUser] = await db.query(
            'SELECT user_id FROM users WHERE user_id = ?',
            [id]
        );

        if (existingUser.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        // Username veya email başka kullanıcıda var mı kontrol et
        if (username || email) {
            const [duplicate] = await db.query(
                'SELECT user_id FROM users WHERE (username = ? OR email = ?) AND user_id != ?',
                [username, email, id]
            );

            if (duplicate.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Bu kullanıcı adı veya email zaten kullanılıyor'
                });
            }
        }

        // Güncelleme
        await db.query(
            `UPDATE users 
             SET username = COALESCE(?, username),
                 email = COALESCE(?, email),
                 first_name = COALESCE(?, first_name),
                 last_name = COALESCE(?, last_name),
                 role = COALESCE(?, role),
                 is_active = COALESCE(?, is_active)
             WHERE user_id = ?`,
            [username, email, first_name, last_name, role, is_active, id]
        );

        res.json({
            success: true,
            message: 'Kullanıcı başarıyla güncellendi'
        });
    } catch (error) {
        console.error('Kullanıcı güncelleme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Kullanıcı güncellenirken hata oluştu'
        });
    }
};

// Kullanıcı şifre sıfırlama (Sadece Admin)
const resetUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { new_password } = req.body;

        if (!new_password || new_password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Şifre en az 6 karakter olmalı'
            });
        }

        // Kullanıcının var olup olmadığını kontrol et
        const [existingUser] = await db.query(
            'SELECT user_id FROM users WHERE user_id = ?',
            [id]
        );

        if (existingUser.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        // Yeni şifreyi hashle
        const hashedPassword = await bcrypt.hash(new_password, 10);

        // Şifreyi güncelle
        await db.query(
            'UPDATE users SET password_hash = ? WHERE user_id = ?',
            [hashedPassword, id]
        );

        res.json({
            success: true,
            message: 'Kullanıcı şifresi başarıyla sıfırlandı'
        });
    } catch (error) {
        console.error('Şifre sıfırlama hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Şifre sıfırlanırken hata oluştu'
        });
    }
};

// Kullanıcı sil (Sadece Admin)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Kendi hesabını silmeye çalışıyor mu?
        if (parseInt(id) === req.user.userId) {
            return res.status(400).json({
                success: false,
                message: 'Kendi hesabınızı silemezsiniz'
            });
        }

        // Kullanıcının var olup olmadığını kontrol et
        const [existingUser] = await db.query(
            'SELECT user_id FROM users WHERE user_id = ?',
            [id]
        );

        if (existingUser.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        // Kullanıcıyı sil
        await db.query('DELETE FROM users WHERE user_id = ?', [id]);

        res.json({
            success: true,
            message: 'Kullanıcı başarıyla silindi'
        });
    } catch (error) {
        console.error('Kullanıcı silme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Kullanıcı silinirken hata oluştu'
        });
    }
};

// Kullanıcı aktivasyon durumunu değiştir (Sadece Admin)
const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;

        // Kendi hesabını deaktive etmeye çalışıyor mu?
        if (parseInt(id) === req.user.userId) {
            return res.status(400).json({
                success: false,
                message: 'Kendi hesabınızın durumunu değiştiremezsiniz'
            });
        }

        const [user] = await db.query(
            'SELECT is_active FROM users WHERE user_id = ?',
            [id]
        );

        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        const newStatus = user[0].is_active ? 0 : 1;

        await db.query(
            'UPDATE users SET is_active = ? WHERE user_id = ?',
            [newStatus, id]
        );

        res.json({
            success: true,
            message: `Kullanıcı ${newStatus ? 'aktif' : 'pasif'} hale getirildi`
        });
    } catch (error) {
        console.error('Durum değiştirme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Durum değiştirilirken hata oluştu'
        });
    }
};

// Sistem istatistikleri (Sadece Admin)
const getSystemStats = async (req, res) => {
    try {
        const stats = {
            users: { total_users: 0, admin_count: 0, user_count: 0, active_users: 0, inactive_users: 0 },
            animals: { total_animals: 0, alive_animals: 0, sold_animals: 0, dead_animals: 0 },
            barns: { total_barns: 0, total_capacity: 0, occupied_spaces: 0 },
            employees: { total_employees: 0, active_employees: 0, inactive_employees: 0 },
            tasks: { total_tasks: 0, pending_tasks: 0, in_progress_tasks: 0, completed_tasks: 0, overdue_tasks: 0 },
            recent_activity: { last_animal_added: null, last_health_record: null, last_production: null, last_task_created: null }
        };

        // Kullanıcı sayıları
        try {
            const [userStats] = await db.query(
                `SELECT 
                    COUNT(*) as total_users,
                    SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_count,
                    SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) as user_count,
                    SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_users,
                    SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive_users
                 FROM users`
            );
            stats.users = userStats[0];
        } catch (err) {
            console.error('User stats error:', err.message);
        }

        // Hayvan sayıları
        try {
            const [animalStats] = await db.query(
                `SELECT 
                    COUNT(*) as total_animals,
                    SUM(CASE WHEN status = 'alive' OR status = 'active' THEN 1 ELSE 0 END) as alive_animals,
                    SUM(CASE WHEN status = 'sold' THEN 1 ELSE 0 END) as sold_animals,
                    SUM(CASE WHEN status = 'dead' THEN 1 ELSE 0 END) as dead_animals
                 FROM animals`
            );
            stats.animals = animalStats[0];
        } catch (err) {
            console.error('Animal stats error:', err.message);
        }

        // Ahır istatistikleri
        try {
            const [barnStats] = await db.query(
                `SELECT 
                    COUNT(*) as total_barns,
                    COALESCE(SUM(capacity), 0) as total_capacity
                 FROM barns`
            );
            const [occupiedResult] = await db.query(
                `SELECT COUNT(*) as occupied_spaces FROM animals WHERE barn_id IS NOT NULL`
            );
            stats.barns = { ...barnStats[0], occupied_spaces: occupiedResult[0].occupied_spaces };
        } catch (err) {
            console.error('Barn stats error:', err.message);
        }

        // Çalışan istatistikleri
        try {
            const [employeeStats] = await db.query(
                `SELECT 
                    COUNT(*) as total_employees,
                    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_employees,
                    SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive_employees
                 FROM employees`
            );
            stats.employees = employeeStats[0];
        } catch (err) {
            console.error('Employee stats error:', err.message);
        }

        // Görev istatistikleri
        try {
            const [taskStats] = await db.query(
                `SELECT 
                    COUNT(*) as total_tasks,
                    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_tasks,
                    SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tasks,
                    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
                    SUM(CASE WHEN status = 'pending' AND due_date < NOW() THEN 1 ELSE 0 END) as overdue_tasks
                 FROM tasks`
            );
            stats.tasks = taskStats[0];
        } catch (err) {
            console.error('Task stats error:', err.message);
        }

        // Son kayıt tarihleri
        try {
            const [animalActivity] = await db.query(`SELECT MAX(created_at) as last_animal_added FROM animals`);
            const [healthActivity] = await db.query(`SELECT MAX(date) as last_health_record FROM health_records`);
            const [productionActivity] = await db.query(`SELECT MAX(date) as last_production FROM production_records`);
            const [taskActivity] = await db.query(`SELECT MAX(created_at) as last_task_created FROM tasks`);

            stats.recent_activity = {
                last_animal_added: animalActivity[0].last_animal_added,
                last_health_record: healthActivity[0].last_health_record,
                last_production: productionActivity[0].last_production,
                last_task_created: taskActivity[0].last_task_created
            };
        } catch (err) {
            console.error('Recent activity error:', err.message);
        }

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Sistem istatistikleri hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sistem istatistikleri alınırken hata oluştu',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Aktivite logları (Sadece Admin) - Gelecek için hazırlık
const getActivityLogs = async (req, res) => {
    try {
        const { limit = 50 } = req.query;
        let logs = [];

        // Her tablodan ayrı ayrı çek ve birleştir
        try {
            const [animalLogs] = await db.query(
                `SELECT 'animal' as type, animal_id as id, tag_number as name, created_at as timestamp 
                 FROM animals ORDER BY created_at DESC LIMIT ?`,
                [Math.floor(parseInt(limit) / 3)]
            );
            logs = [...logs, ...animalLogs];
        } catch (err) {
            console.error('Animal logs error:', err.message);
        }

        try {
            const [taskLogs] = await db.query(
                `SELECT 'task' as type, task_id as id, title as name, created_at as timestamp 
                 FROM tasks ORDER BY created_at DESC LIMIT ?`,
                [Math.floor(parseInt(limit) / 3)]
            );
            logs = [...logs, ...taskLogs];
        } catch (err) {
            console.error('Task logs error:', err.message);
        }

        try {
            const [employeeLogs] = await db.query(
                `SELECT 'employee' as type, employee_id as id, CONCAT(first_name, ' ', last_name) as name, created_at as timestamp 
                 FROM employees ORDER BY created_at DESC LIMIT ?`,
                [Math.floor(parseInt(limit) / 3)]
            );
            logs = [...logs, ...employeeLogs];
        } catch (err) {
            console.error('Employee logs error:', err.message);
        }

        // Timestamp'e göre sırala
        logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        logs = logs.slice(0, parseInt(limit));

        res.json({
            success: true,
            data: logs
        });
    } catch (error) {
        console.error('Aktivite log hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Aktivite logları alınırken hata oluştu',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    resetUserPassword,
    deleteUser,
    toggleUserStatus,
    getSystemStats,
    getActivityLogs
};
