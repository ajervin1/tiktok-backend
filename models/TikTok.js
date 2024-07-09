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
	stats: {
		collectCount: Number,
		commentCount: Number,
		diggCount: Number,
		playCount: Number,
		shareCount: Number
	},
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
	return this.find({ 'author.uniqueId': uniqueId }).sort({ 'stats.playCount': -1 }).limit(10);
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
				date: {
					$dateFromParts: {
						year: "$_id.year",
						month: "$_id.month",
						day: 1
					}
				},
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
				date: {
					$dateFromParts: {
						year: "$_id.year",
						month: "$_id.month",
						day: 1
					}
				},
				totalPlayCount: 1
			}
		}

	]);
};
const TikTok = mongoose.model('TikTok', TikTokSchema);

export default TikTok