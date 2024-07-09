import express from 'express'
import TikTok from '../models/TikTok.js'
import { getTikTokByUserId, getUserInfo } from "../services/tiktokservice.js";
import User from "../models/User.js";

const router = express.Router();


/* Scrape Data Queries */
router.get('/scrape-user-tiktoks', async ( req, res ) => {
	const { username } = req.query;
	const userObject = await getUserInfo(username);
	const doc = await User.findOneAndUpdate({ _id: userObject.userId },
		userObject,
		{ upsert: true, new: true, runValidators: true }
	)
	const { userId } = userObject;
	console.log(userId)
	const { tiktoks, hasMore, newCursor } = await getTikTokByUserId(userId)
	const result = await TikTok.insertMany(tiktoks, { ordered: false });
	res.send(result);
});
router.get('/scrape-userinfo', async ( req, res ) => {
	const username = req.query.username;
	const userObject = await getUserInfo(username);
	const doc = await User.findOneAndUpdate({ _id: userObject.userId },
		userObject,
		{ upsert: true, new: true, runValidators: true }
	)
	res.send(userObject);
})

/* Database Queries */
router.get('/user/tiktoks', async ( req, res ) => {
	const { username } = req.query;
	const tiktoks = await TikTok.findByAuthorUniqueId(username);
	res.send(tiktoks);
})

// Search Results Page
router.get('/user/search', async ( req, res ) => {
	const { username } = req.query;
	const users = await User.findByPattern(username);
	res.send(users);
})


// Details Page
/* Top TikToks For A  User */
router.get('/user/tiktoks-top', async ( req, res ) => {
	const { username } = req.query;
	const tiktoks = await TikTok.findByAuthorUniqueIdSorted(username)
	res.send(tiktoks);
})


router.get('/user/userinfo', async ( req, res ) => {
	const { username } = req.query;
	const tiktoks = await TikTok.findByAuthorUniqueIdSorted(username)
	res.send(tiktoks);
})


// Details Page Chart
router.get('/user/tiktoks-average-views', async ( req, res ) => {
	const { username } = req.query;
	const averagePlayCountByMonth = await TikTok.getAveragePlayCountByMonthForUniqueId(username);
	res.send(averagePlayCountByMonth);
})
// Details Page Chart
// Get Total Views Monthly
router.get('/user/tiktoks-total-views', async ( req, res ) => {
	const { username } = req.query;
	const totalPlayCountByMonth = await TikTok.getTotalPlayCountByMonthForUniqueId(username);
	res.send(totalPlayCountByMonth);
})


export default router
