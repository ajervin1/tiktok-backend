
import express from 'express'
import TikTok from '../models/TikTok.js'
import { getTikTokByUserId, getUserInfo } from "../services/tiktokservice.js";

const router = express.Router();


// Get all users
router.get('/user/tiktoks', async (req, res) => {
	const {username} = req.query;
	const userObject = await getUserInfo(username);
	const {userId} = userObject;
	console.log(userId)
	const {tiktoks, hasMore, newCursor} = await getTikTokByUserId(userId)
	try {
		const result = await TikTok.insertMany(tiktoks);
		res.send(result)
	} catch ( e ) {
		res.send(e.message)
	}

});
router.get('/userinfo', async (req,res) => {
	const username = req.query.username;
	const userObject = await getUserInfo(username);
	res.send(userObject);
})


export default router
