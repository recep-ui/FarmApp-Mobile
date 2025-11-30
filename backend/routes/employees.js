const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const employeeController = require('../controllers/employeeController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);

router.post('/', [
    body('first_name').notEmpty().withMessage('Ad gerekli'),
    body('last_name').notEmpty().withMessage('Soyad gerekli'),
    body('hire_date').optional().isISO8601().withMessage('Geçerli bir tarih girin')
], employeeController.createEmployee);

router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
