const db = require('../config/database');

exports.getDashboardStats = async (req, res) => {
    let connection;
    try {
        // Tek bir bağlantı al
        connection = await db.getConnection();

        // 1. Hayvan İstatistikleri
        const [animalStats] = await connection.query(`
            SELECT 
                COUNT(*) as total_animals,
                COUNT(CASE WHEN species = 'Cow' THEN 1 END) as total_cows,
                COUNT(CASE WHEN species = 'Sheep' THEN 1 END) as total_sheep,
                COUNT(CASE WHEN species = 'Chicken' THEN 1 END) as total_chickens,
                COUNT(CASE WHEN species = 'Goat' THEN 1 END) as total_goats,
                COUNT(CASE WHEN status = 'active' THEN 1 END) as active_animals,
                SUM(total_production) as total_production
            FROM animals
        `);

        // 2. Görev İstatistikleri
        const [taskStats] = await connection.query(`
            SELECT 
                COUNT(*) as total_tasks,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_tasks,
                COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tasks,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
                COUNT(CASE WHEN due_date < NOW() AND status != 'completed' THEN 1 END) as overdue_tasks
            FROM tasks
        `);

        // 3. Üretim İstatistikleri
        const [productionStats] = await connection.query(`
            SELECT 
                product_type,
                SUM(quantity) as total_quantity,
                AVG(quantity) as avg_quantity,
                COUNT(*) as record_count,
                MAX(unit) as unit
            FROM production_records
            GROUP BY product_type
        `);

        res.json({
            success: true,
            data: {
                animals: animalStats[0],
                tasks: taskStats[0],
                production: productionStats
            }
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    } finally {
        if (connection) connection.release();
    }
};
