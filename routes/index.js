const equipmentRoutes = require('./equipment.routes');
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const router = require('express').Router();
const { ensureAuthenticated } = require('../config/security.config');

const indexController = require('../controllers/indexController');

/* GET home page. */

router.get('/', ensureAuthenticated, indexController.getIndex);
router.use('/equipment', ensureAuthenticated, equipmentRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

module.exports = router;