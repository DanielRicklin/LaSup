var express = require('express');
var router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const { body } = require('express-validator');

router.get(
    '/create',
    equipmentController.create
);

router.post(
    '/create',
    body('name', 'Un nom doit être donné sous forme de chaine de caractère').isString().not().isEmpty(),
    body('ip', 'L\'IP doit être renseigné').isString().not().isEmpty(),
    equipmentController.postCreate
);

router.get('/:ip/interfaces', equipmentController.getInterfaces);
router.get('/:id/data', equipmentController.getData);

router.get('/:id', equipmentController.getOne);
router.delete('/:id', equipmentController.deleteEquipment);


module.exports = router;
