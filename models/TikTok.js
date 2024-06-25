import  mongoose, {Schema}  from 'mongoose';


const TikTokSchema = new mongoose.Schema({
	_id: {type: String},
	id: String,
	createTime: Number,
	createdAt: Date,
	dateCreated : {type: Date, default: Date.now},
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
	challenges: [Schema.Types.Mixed],
	contents: [Schema.Types.Mixed],
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
	textExtra: [Schema.Types.Mixed],
	video: {
		downloadAddr: String,
		duration: Number,
		dynamicCover: String,
		id: String
	}
}, {_id: false });

TikTokSchema.statics.findByAuthorUniqueId = function(uniqueId) {
  return this.find({ 'author.uniqueId': uniqueId });
};

TikTokSchema.statics.findByAuthorUniqueIdSorted = function(uniqueId) {
	return this.find({ 'author.uniqueId': uniqueId }).sort({ 'stats.playCount': -1 }).limit(3);
};

TikTokSchema.statics.findDistinctAuthorsByName = function(name) {
	return this.aggregate([
		{
			$match: {
				'author.uniqueId': new RegExp(name, 'i')
			}
		},
		{
			$group: {
				_id: '$author.secUid',
				author: {
					$first: '$author'
				}
			}
		},
		{
			$replaceRoot: {
				newRoot: '$author'
			}
		}
	]);
};

const TikTok = mongoose.model('TikTok', TikTokSchema);

export default TikTok