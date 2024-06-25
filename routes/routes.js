
import express from 'express'
import TikTok from '../models/TikTok.js'
import { getTikTokByUserId } from "../services/index.js";

const router = express.Router();


// Get all users
router.get('/tiktoks', async (req, res) => {
	const {tiktoks, hasMore, newCursor} = await getTikTokByUserId()
	let result = []
	TikTok.insertMany(tiktoks, {
		ordered: false
	}).then(docs => {
		result = docs;
		console.log("Documents inserted successfully")
	})
	.catch(error => {
		console.log("Error in inserting documents", error);
	})
	res.send(result)
});


export default router
