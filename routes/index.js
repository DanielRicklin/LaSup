const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

const app = express();

app.use(express.urlencoded({
    extended: true
  }))

/* GET home page. */
router.get('/', indexController.getIndex);

module.exports = router;