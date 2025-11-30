const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const taskController = require('../controllers/taskController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', taskController.getAllTasks);
router.get('/stats', taskController.getTaskStats);
router.get('/:id', taskController.getTaskById);

router.post('/', [
    body('title').notEmpty().withMessage('Görev başlığı gerekli'),
    body('due_date').optional().isISO8601().withMessage('Geçerli bir tarih girin'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Öncelik: low, medium veya high olmalı')
], taskController.createTask);

router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
