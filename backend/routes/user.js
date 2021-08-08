const express           = require('express');
const router            = express.Router();
const userCtrl          = require('../controllers/user');
const checkPassword     = require('../middleware/checkPassword');

router.post('/signup', checkPassword, userCtrl.register);
router.post('/login', userCtrl.login);

module.exports = router;