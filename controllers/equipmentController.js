const { validationResult } = require('express-validator')
const snmp = require('snmp-native')
const Equipment = require('../models/equipmentModel')
const Ping = require('../models/pingModel')

function averageDataBy5MinutesInterval(data) {
    let averagedData = {};

    for (let i = 0; i < data.length; i++) {
        let date = new Date(data[i].createdAt);

        date.setMinutes(Math.ceil(Math.floor(date.getMinutes()) / 5) * 5)
        date.setSeconds(0)
        date.setUTCMilliseconds(0)

        if (!averagedData[date]) {
            averagedData[date] = {
                createdAt: date,
                latency: 0,
                pertes: 0,
                count: 0
            };
        }

        averagedData[date].latency += data[i].latency == 'unknown' ? 0 : parseInt(data[i].latency);
        averagedData[date].pertes += data[i].latency == 'unknown' ? 1 : 0;
        averagedData[date].count++;
    }

    for (let key in averagedData) {
        averagedData[key].latency = averagedData[key].latency / averagedData[key].count;
        averagedData[key].pertes = (averagedData[key].pertes * 100) / averagedData[key].count;
    }

    let averagedDataArray = [];
    for (let key in averagedData) {
        averagedDataArray.push(averagedData[key]);
    }
    return averagedDataArray;
}

exports.getOne = function(req, res){
    let equipment = Equipment.findById(req.params.id)
    .populate('user')
    .then((eq)=>{
        console.log(req.user._id, eq.user._id)
        if (req.user._id.equals(eq.user._id) || req.user._id.equals("63cee1d89c18976a33a39727")) {
            res.render('pages/equipment', { page: "getOne", equipment: eq, err: false, user: req.user})
        } else {
            res.status(404).render('pages/equipment', { page: "getOne", err, user: req.user})
        }
    })
    .catch((err) => {
        res.status(404).render('pages/equipment', { page: "getOne", err, user: req.user})
    })
}

exports.create = function(req, res){
    res.render('pages/equipment', { page: "create", user: req.user})
}

exports.postCreate = function(req, res){
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array() })
    } else {
        let equipment = new Equipment({
            name: req.body.name,
            ip: req.body.ip,
            description: req.body.description,
            user: req.user._id
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

exports.getData = async function(req, res){
    let data = await Ping.find({'equipment': req.params.id, createdAt: {$gte: new Date(Date.now() - 8*60*60*1000)}})
    .select("latency createdAt ip")
    
    return res.status(200).json(averageDataBy5MinutesInterval(data))
}

exports.getLastData = function(req, res){
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    let data = Ping.find({'equipment': req.params.id})
    .select("latency createdAt")
    .limit(1)
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

exports.deleteEquipment = async function(req, res){
    try{
        await Ping.deleteMany({'equipment': req.params.id})
        await Equipment.deleteOne({'_id': req.params.id})
        return res.status(200).json('Ouiiiiii')
    }catch (error){
        return res.status(500).json('ALED')
    }
}