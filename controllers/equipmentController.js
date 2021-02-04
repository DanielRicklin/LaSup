const { validationResult } = require('express-validator')
const snmp = require('snmp-native')
const Equipment = require('../models/equipmentModel')
const Ping = require('../models/pingModel')

exports.getOne = function(req, res){
    let equipment = Equipment.findById(req.params.id)
    .then((eq)=>{
        res.render('pages/equipment', { page: "getOne", equipment: eq, err: false})
    })
    .catch((err) => {
        res.status(404).render('pages/equipment', { page: "getOne", err})
    })
}

exports.create = function(req, res){
    res.render('pages/equipment', { page: "create"})
}

exports.postCreate = function(req, res){
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array() })
    } else {
        let equipment = new Equipment({
            name: req.body.name,
            ip: req.body.ip,
            description: req.body.description
        }).save((err, equipment) => {
            if(err) return res.status(200).json({ error: err })
            else return res.status(201).json({ message: "Cétoubon", id: equipment.id })
        })
    }
}

exports.getInterfaces = function(req, res){
    let session = new snmp.Session({ host: `${req.params.ip}`, port: 161, community: 'public' })
    let interfaces = []
    session.getSubtree({ oid: [1, 3, 6, 1, 2, 1, 2, 2, 1, 2] }, function (error, varbinds) {
        if(error){
            console.log(error);
        } else{
            varbinds.forEach(function (vb, index) {
                interfaces[index] = {name: vb.value, integer: index+1}
            })
            return res.status(200).json({interfaces})
        }
    })
}

// function setHourPerso(heure, index){
//     console.log(heure.getHours())
//     // if((heure.getHours() - index) >= 0){
//     //     return heure.getHours() - index
//     // } else {
//     //     return 24 - (heure.getHours() - index)
//     // }
// }

exports.getData = function(req, res){
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    let dateaez = new Date().toLocaleString("fr-FR", {timeZone: "Europe/Paris"})
    console.log(new Date(dateaez).getHours())
    // console.log(setHourPerso(new Date().toLocaleString("fr-FR", {timeZone: "Europe/Paris"}), 8))
    let data = Ping.find({'equipment': req.params.id}) //, createdAt: {$gte: new Date().setHours, $lt: new Date()}}
    .select("latency createdAt ip")
    .then(pings => {
        let resultat = []
        let latencyCache = []
        let pertesCache = []
        let last = 0
        pings.forEach(ping => {
            if(new Date(ping.createdAt).getSeconds() > last) {
                latencyCache.push(ping.latency !== 'unknown' ? Math.floor((Math.round(ping.latency * 100)).toFixed(2))/100 : 0)
                pertesCache.push(ping.latency == 'unknown' ? 1 : 0)
                last = new Date(ping.createdAt).getSeconds()
            } else {
                last = 0
                let moyenneLatency = latencyCache.reduce(reducer) / latencyCache.length
                let moyennePertes = pertesCache.reduce(reducer) / pertesCache.length
                resultat.push({latency: moyenneLatency, createdAt: new Date(ping.createdAt).setSeconds(0), pertes: moyennePertes})
                latencyCache = []
                pertesCache = []
            }
        })
        return res.status(200).json(resultat)
    }).catch(err => console.log)
}