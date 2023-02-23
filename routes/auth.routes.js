const {  signinForm, signin, signout} = require('../controllers/authController');
const router = require('express').Router();

router.get('/signin', signinForm);
router.post('/signin', signin);
router.get('/signout', signout);

module.exports = router;