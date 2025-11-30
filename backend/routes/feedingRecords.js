const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const feedingRecordController = require('../controllers/feedingRecordController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', feedingRecordController.getAllFeedingRecords);
router.get('/:id', feedingRecordController.getFeedingRecordById);

router.post('/', [
    body('animal_id').isInt().withMessage('Geçerli bir hayvan ID gerekli'),
    body('date').isISO8601().withMessage('Geçerli bir tarih gerekli'),
    body('feed_type').notEmpty().withMessage('Yem türü gerekli'),
    body('quantity').isFloat({ min: 0 }).withMessage('Miktar 0\'dan büyük olmalı'),
    body('unit').notEmpty().withMessage('Birim gerekli')
], feedingRecordController.createFeedingRecord);

router.put('/:id', feedingRecordController.updateFeedingRecord);
router.delete('/:id', feedingRecordController.deleteFeedingRecord);

module.exports = router;
