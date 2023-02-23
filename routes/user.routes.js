const { userNew, userCreate, getProfile, updateUser } = require('../controllers/userController');
const router = require('express').Router();

router.get('/new', userNew);
router.post('/', userCreate);
router.get('/profile', getProfile);
router.post('/profile', updateUser);

module.exports = router;