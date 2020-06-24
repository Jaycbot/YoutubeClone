const express = require('express');
const router = express.Router();
const { Subscriber } = require('../models/Subscriber');


router.post('/subscribeNumber', (req, res) => {
    //find는 케이스들을 리턴, 즉 구독을 몇명이 했는지는 .length로 처리 해 줄수있음
    Subscriber.find({'userTo': req.body.userTo}).exec((err,subscribe)=>{
        if(err) return res.status(400).send(err)
        return res.status(200).json({success:true, subscribeNumber: subscribe.length})
    })
	
});

router.post('/subscribed', (req, res) => {
    //둘다 만족시키는 것을 찾으면 그 사람을 구독하고 있는 것 이지만, subscribe가 0을 반환시 구독하고 있지 않다는 것.
    Subscriber.find({'userTo':req.body.userTo, 'userFrom': req.body.userFrom}).exec((err, subscribe)=>{
        if(err) return res.status(400).send(err)
        let result = false;
        if(subscribe !==0){
            result = true;
        }
        res.status(200).json({success:true, subscribed: result})
    })
	
});

module.exports = router;
