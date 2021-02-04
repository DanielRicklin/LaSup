const Equipment = require('../models/equipmentModel')

exports.getIndex = function(req, res){
    Equipment.find({}).then(response => {
        // console.log(response)
        res.render('index', {equipments: response});
    }).catch(err => console.log)
}