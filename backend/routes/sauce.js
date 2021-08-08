const express       = require('express');
const router        = express.Router();
const auth          = require('../middleware/auth');
const saucesControl = require('../controllers/sauce');
const stockage      = require('../middleware/stockage');

router.post('/', auth, stockage, saucesControl.createSauce);
router.put('/:id', auth, stockage, saucesControl.editSauce);
router.delete('/:id', auth, saucesControl.removeSauce);
router.get('/:id', auth, saucesControl.getSauce);
router.get('/', auth, saucesControl.getAllSauces);
router.post('/:id/like', auth, saucesControl.like)

module.exports = router;