const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const videoSchema = mongoose.Schema(
	{
		writer: {
			type: Schema.Types.ObjectId, //이렇게 넣으면 ObjectId를 넣으면 ref프로퍼티로 User모델을 다 긁어 올 수 있음
			ref: 'User',
		},
		title: {
			type: String,
			maxlength: 50,
		},
		description: {
			type: String,
		},
		privacy: {
			type: Number,
		},
		filePath: {
			type: String,
		},
		category: {
			type: String,
		},
		views: {
			type: Number,
			default: 0,
		},
		duration: {
			type: String,
		},
		thumbnail: {
			type: String,
		},
	},
	{ timestamps: true }
);
//timestamps: 만든 시간과 업데이트 된 시간이 표시가 됨.

const Video = mongoose.model('Video', videoSchema);

module.exports = { Video };
