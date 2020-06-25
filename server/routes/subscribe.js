const express = require('express');
const router = express.Router();
const { Subscriber } = require('../models/Subscriber');

router.post('/subscribeNumber', (req, res) => {
	//find는 케이스들을 리턴, 즉 구독을 몇명이 했는지는 .length로 처리 해 줄수있음
	Subscriber.find({ userTo: req.body.userTo }).exec((err, subscribe) => {
		if (err) return res.status(400).send(err);

		return res
			.status(200)
			.json({ success: true, subscribeNumber: subscribe.length });
	});
});

router.post('/subscribed', (req, res) => {
	//둘다 만족시키는 것을 찾으면 그 사람을 구독하고 있는 것 이지만, subscribe가 0을 반환시 구독하고 있지 않다는 것.
	Subscriber.find({
		userTo: req.body.userTo,
		userFrom: req.body.userFrom,
	}).exec((err, subscribe) => {
		if (err) return res.status(400).send(err);
		let result = false;
		if (subscribe !== 0) {
			result = true;
		}
		res.status(200).json({ success: true, subscribed: result });
	});
});

router.post('/unSubscribe', (req, res) => {
	//이미 구독중 이므로, 해당 userTo와 userFrom이 일치하는 것을 찾아서 제거를 해준다.
	Subscriber.findOneAndDelete({
		userTo: req.body.userTo,
		userFrom: req.body.userFrom,
	}).exec((err, doc) => {
		if (err) return status(400).json({ success: false, err });
		res.status(200).json({ success: true, doc });
	});
});

router.post('/subscribe', (req, res) => {
	//새로운 모델을 만든다. 구독을 하지 않은 상태이기 때문에, 구독상태로 집어넣기 위해서.
	const subscribe = new Subscriber(req.body);
	subscribe.save((err, doc) => {
		if (err) return res.json({ success: false, err });
		res.status(200).json({ success: true });
	});
});
module.exports = router;
