import  mongoose, {Schema}  from 'mongoose';


const TikTokSchema = new mongoose.Schema({
	_id: {type: String},
	id: String,
	createTime: Number,
	desc: String,
	author: {
		avatarLarger: String,
		id: String,
		nickname: String,
		secUid: String,
		signature: String,
		uniqueId: String,
		verified: Boolean
	},
	challenges: [{
		coverLarger: String,
		desc: String,
		id: String,
		profileLarger: String,
		title: String
	}],
	contents: [{
		desc: String,
		textExtra: [{
			awemeId: String,
			end: Number,
			hashtagName: String,
			isCommerce: Boolean,
			secUid: String,
			start: Number,
			subType: Number,
			type: Number,
			userId: String,
			userUniqueId: String
		}]
	}],
	music: {
		authorName: String,
		coverLarge: String,
		duration: Number,
		id: String,
		original: Boolean,
		playUrl: String,
		title: String
	},
	stats: {
		collectCount: Number,
		commentCount: Number,
		diggCount: Number,
		playCount: Number,
		shareCount: Number
	},
	textExtra: [{
		awemeId: String,
		end: Number,
		hashtagName: String,
		isCommerce: Boolean,
		secUid: String,
		start: Number,
		subType: Number,
		type: Number,
		userId: String,
		userUniqueId: String
	}],
	video: {
		downloadAddr: String,
		duration: Number,
		dynamicCover: String,
		id: String
	}
}, {_id: false });

const TikTok = mongoose.model('TikTok', TikTokSchema);

export default TikTok