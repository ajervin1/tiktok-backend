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
// TikToks By UniqueId
TikTokSchema.statics.findByAuthorUniqueId = function(uniqueId) {
  return this.find({ 'author.uniqueId': uniqueId });
};
// Top 3 Tiktoks
TikTokSchema.statics.findByAuthorUniqueIdSorted = function(uniqueId) {
	return this.find({ 'author.uniqueId': uniqueId }).sort({ 'stats.playCount': -1 }).limit(3);
};
// Search Function
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
// Average TikToks
TikTokSchema.statics.getAveragePlayCountByMonthForUniqueId = function(uniqueId) {
	return this.aggregate([
		{
			$match: {
				'author.uniqueId': uniqueId
			}
		},
		{
			$group: {
				_id: {
					month: { $month: "$createdAt" },
					year: { $year: "$createdAt" }
				},
				averagePlayCount: { $avg: "$stats.playCount" }
			}
		},
		{
			$sort: {
				"_id.year": 1,
				"_id.month": 1
			}
		},
		{
			$project: {
				_id: 0,
				month: "$_id.month",
				year: "$_id.year",
				averagePlayCount: 1
			}
		}
	]);
};
// Total TikToks Monthly
TikTokSchema.statics.getTotalPlayCountByMonthForUniqueId = function(uniqueId) {
	return this.aggregate([
		{
			$match: {
				'author.uniqueId': uniqueId
			}
		},
		{
			$group: {
				_id: {
					month: { $month: "$createdAt" },
					year: { $year: "$createdAt" }
				},
				totalPlayCount: { $sum: "$stats.playCount" }
			}
		},
		{
			$sort: {
				"_id.year": 1,
				"_id.month": 1
			}
		},
		{
			$project: {
				_id: 0,
				month: "$_id.month",
				year: "$_id.year",
				totalPlayCount: 1
			}
		}

	]);
};
const TikTok = mongoose.model('TikTok', TikTokSchema);

export default TikTok