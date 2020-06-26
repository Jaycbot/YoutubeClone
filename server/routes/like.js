const express = require('express');
const router = express.Router();
const { Like } = require('../models/Like');
const { Dislike } = require('../models/Dislike');

router.post('/getLikes', (req, res) => {
	//댓글에서 좋아요인지, 비디오에서 좋아요인지 분기해줌

	let variable = {};
	if (req.body.videoId) {
		variable = { videoId: req.body.videoId };
	} else {
		variable = { commentId: req.body.commentId };
	}
	Like.find(variable).exec((err, likes) => {
		if (err) return res.status(400).send(err);
		res.status(200).json({ success: true, likes });
	});
});

router.post('/getDislikes', (req, res) => {
	let variable = {};
	if (req.body.videoId) {
		variable = { videoId: req.body.videoId };
	} else {
		variable = { commentId: req.body.commentId };
	}
	Dislike.find(variable).exec((err, dislikes) => {
		if (err) return res.status(400).send(err);
		res.status(200).json({ success: true, dislikes });
	});
});

router.post('/upLike', (req, res) => {
	let variable = {};
	if (req.body.videoId) {
		variable = { videoId: req.body.videoId, userId: req.body.userId };
	} else {
		variable = { commentId: req.body.commentId, userId: req.body.userId };
	}
	//1 Like Collection에 클릭 정보를 넣어 줌
	const like = new Like(variable);
	like.save((err, likeResult) => {
		if (err) return res.json({ success: false, err });
		//2 만약에 Dislike이 이미 클릭이 되었다면, Dislike을 1 줄여준다
		Dislike.findOneAndDelete(variable).exec((err, disLikeResult) => {
			if (err) return res.status(400).json({ success: false, err });
			res.status(200).json({ success: true });
		});
	});
});

router.post('/unLike', (req, res) => {
	let variable = {};
	if (req.body.videoId) {
		variable = { videoId: req.body.videoId, userId: req.body.userId };
	} else {
		variable = { commentId: req.body.commentId, userId: req.body.userId };
	}
	Like.findOneAndDelete(variable).exec((err, result) => {
		if (err) return res.status(400).json({ success: false, err });
		res.status(200).json({ success: true });
	});
});
router.post('/unDislike', (req, res) => {
	let variable = {};
	if (req.body.videoId) {
		variable = { videoId: req.body.videoId, userId: req.body.userId };
	} else {
		variable = { commentId: req.body.commentId, userId: req.body.userId };
	}
	Dislike.findOneAndDelete(variable).exec((err, result) => {
		if (err) return res.status(400).json({ success: false, err });
		res.status(200).json({ success: true });
	});
});

router.post('/upDislike', (req, res) => {
	let variable = {};
	if (req.body.videoId) {
		variable = { videoId: req.body.videoId, userId: req.body.userId };
	} else {
		variable = { commentId: req.body.commentId, userId: req.body.userId };
	}
	//1 Dislike Collection에 클릭 정보를 넣어 줌
	const dislike = new Dislike(variable);
	dislike.save((err, dislikeResult) => {
		if (err) return res.json({ success: false, err });
		//2 만약에 like이 이미 클릭이 되었다면, like을 1 줄여준다
		Like.findOneAndDelete(variable).exec((err, LikeResult) => {
			if (err) return res.status(400).json({ success: false, err });
			res.status(200).json({ success: true });
		});
	});
});

module.exports = router;
