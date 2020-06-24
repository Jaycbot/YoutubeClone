const express = require('express');
const router = express.Router();
const { Video } = require('../models/Video');

const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
//video
let storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}_${file.originalname}`);
	},
	fileFilter: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		if (ext !== '.mp4') {
			return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
		}
		cb(null, true);
	},
});
const upload = multer({ storage: storage }).single('file');
router.post('/uploadfiles', (req, res) => {
	//비디오를 서버에 저장한다.
	upload(req, res, (err) => {
		if (err) {
			return res.json({ success: false, err });
		}
		//url은 파일의 경로
		return res.json({
			success: true,
			url: res.req.file.path,
			fileName: res.req.file.filename,
		});
	});
});

router.post('/thumbnail', (req, res) => {
	//썸네일 생성 하고 비디오 러닝타임도 가져오기
	let filePath = '';
	let fileDuration = '';
	//비디오 정보 가져오기
	ffmpeg.ffprobe(req.body.url, function (err, metadata) {
		fileDuration = metadata.format.duration;
	});

	//썸네일 생성
	ffmpeg(req.body.url)
		.on('filenames', function (filenames) {
			//가져온 url을 바탕으로 filename 생성 - thumbnamil
			console.log('Will generate' + filenames.join(', '));
			console.log(filenames);
			filePath = 'uploads/thumbnails/' + filenames[0];
		})
		.on('end', function () {
			//thumbnail을 생성하고 무엇을 할 것인지.
			console.log('Screenshots taken');
			return res.json({
				success: true,
				url: filePath,
				fileDuration: fileDuration,
			});
		})
		.on('error', function (err) {
			console.log(err);
			return res.json({ success: false, err });
		})
		.screenshots({
			//count - 몇개의 thumbnail을 찍을 것인지
			//folder - 해당 썸네일 저장 위치
			// Will take screenshots at 20%, 40% , 60% and 80% of the video
			count: 3,
			folder: 'uploads/thumbnails',
			size: '320x240',
			//%b : input basename ( filename w/o(without) extention)
			filename: 'thumbnail-%b.png',
		});
});

router.post('/uploadVideo', (req, res) => {
	//비디오 정보들을 저장한다.
	const video = new Video(req.body);
	video.save((err, doc) => {
		if (err) return res.json({ success: false, err });
		res.status(200).json({ success: true });
	});
});
router.get('/getVideos', (req, res) => {
	//비디오를 DB에서 가져와서 클라이언트에 보낸다.
	//find - Video collection에서 모든 video를 가져온다.
	//populate - 합치다 - 이 method를 사용해주는 이유는
	//writer에서 object로 연관시켰기 때문에 writer에 할당 된 User 모델까지 다 가져오기 위해서 사용
	Video.find()
		.populate('writer')
		.exec((err, videos) => {
			if (err) return res.status(400).send(err);
			res.status(200).json({ success: true, videos });
		});
});

router.post('/getVideoDetail', (req, res) => {
	Video.findOne({ _id: req.body.videoId })
		.populate('writer')
		.exec((err, videoDetail) => {
			if (err) return res.status(400).send(err);
			return res.status(200).json({ success: true, videoDetail });
		});
});
module.exports = router;
