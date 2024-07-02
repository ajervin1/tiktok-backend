import mongoose from 'mongoose';

const userInfo = {
	"diggCount": 0,
	"followerCount": 7700000,
	"followingCount": 981,
	"friendCount": 704,
	"heart": 947300000,
	"heartCount": 947300000,
	"videoCount": 4633,
	"avatarLarger": "https://p19-pu-sign-useast8.tiktokcdn-us.com/tos-useast8-avt-0068-tx2/eaf66a39affdabf4b7d5c989db41bbfd~c5_1080x1080.jpeg?lk3s=a5d48078&nonce=73860&refresh_token=a91321efbd825ed79e535cc5c5f201a2&x-expires=1719464400&x-signature=nB%2FRocl4vGQzQAtNKTWppS7i70I%3D&shp=a5d48078&shcp=81f88b70",
	"nickname": "olivia ponton",
	"sig": "☆.。.・°☆.。.:*・°☆\n🏳️‍🌈\nimg wurrrlldwide",
	"uniqueId": "iamoliviaponton",
	"userId": "MS4wLjABAAAAkHqDeyBnVyzzQuNOTvVovc8nECyp7ltnevHrJ7M4m865FlyzYPz-wglzujTcQyd6"
}

const UserSchema = new mongoose.Schema({
	_id: { type: String },
	diggCount: Number,
	followerCount: Number,
	followingCount: Number,
	friendCount: Number,
	heart: Number,
	heartCount: Number,
	videoCount: Number,
	avatarLarger: String,
	nickname: String,
	sig: String,
	uniqueId: String,
	userId: String
}, { _id: false, timestamps: true });
UserSchema.statics.findByPattern = function(pattern) {
	return this.find({ "uniqueId": { "$regex": `${pattern}`, $options: 'i' } });
};
const User = mongoose.model('User', UserSchema);

export default User;