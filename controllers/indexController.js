const Equipment = require('../models/equipmentModel')

exports.getIndex = function(req, res){
    if(req.user._id.equals('63cee1d89c18976a33a39727')){
        Equipment.find()
        .then(response => {
            res.render('index', {equipments: response, user: req.user});
        }).catch(err => console.log)
    }

    Equipment.find({user: req.user._id}).then(response => {
        // console.log(response)
        res.render('index', {equipments: response, user: req.user});
    }).catch(err => console.log)
}