const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const productionRecordController = require('../controllers/productionRecordController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', productionRecordController.getAllProductionRecords);
router.get('/stats', productionRecordController.getProductionStats);
router.get('/:id', productionRecordController.getProductionRecordById);

router.post('/', [
    body('animal_id').isInt().withMessage('Geçerli bir hayvan ID gerekli'),
    body('date').isISO8601().withMessage('Geçerli bir tarih gerekli'),
    body('product_type').notEmpty().withMessage('Ürün türü gerekli'),
    body('quantity').isFloat({ min: 0 }).withMessage('Miktar 0\'dan büyük olmalı'),
    body('unit').notEmpty().withMessage('Birim gerekli')
], productionRecordController.createProductionRecord);

router.put('/:id', productionRecordController.updateProductionRecord);
router.delete('/:id', productionRecordController.deleteProductionRecord);

module.exports = router;
