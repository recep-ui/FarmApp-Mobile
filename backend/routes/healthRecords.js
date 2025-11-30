const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const healthRecordController = require('../controllers/healthRecordController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', healthRecordController.getAllHealthRecords);
router.get('/:id', healthRecordController.getHealthRecordById);

router.post('/', [
    body('animal_id').isInt().withMessage('Geçerli bir hayvan ID gerekli'),
    body('date').isISO8601().withMessage('Geçerli bir tarih gerekli')
], healthRecordController.createHealthRecord);

router.put('/:id', healthRecordController.updateHealthRecord);
router.delete('/:id', healthRecordController.deleteHealthRecord);

module.exports = router;
