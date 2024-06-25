import express from 'express'
import TikTok from '../models/TikTok.js'
import { getTikTokByUserId, getUserInfo } from "../services/tiktokservice.js";

const router = express.Router();


/* Scrape Data Queries */
router.get('/scrape-user-tiktoks', async ( req, res ) => {
	const { username } = req.query;
	const userObject = await getUserInfo(username);
	const { userId } = userObject;
	const { tiktoks, hasMore, newCursor } = await getTikTokByUserId(userId)
	try {
		const result = await TikTok.insertMany(tiktoks, { ordered: false });
		res.send(result)
	} catch ( e ) {
		res.send(e.message)
	}

});
router.get('/scrape-userinfo', async ( req, res ) => {
	const username = req.query.username;
	const userObject = await getUserInfo(username);
	res.send(userObject);
})

/* Database Queries */
// Get All TikToks for a user in a database
router.get('/user/tiktoks', async ( req, res ) => {
	const tiktoks = await TikTok.findByAuthorUniqueId(req.query.username);
	res.send(tiktoks);
})

// Search for a user's TikToks
router.get('/user/search', async ( req, res ) => {
	const { username } = req.query;
	const authors = await TikTok.findDistinctAuthorsByName(username);
	res.send(authors);
})

// Get Top Viewed TikToks for a user
router.get('/user/tiktoks-top', async ( req, res ) => {
	const username = req.query.username;
	const tiktoks = await TikTok.findByAuthorUniqueIdSorted(username)
	res.send(tiktoks);
})

// Get Average Views Monthly TikToks
router.get('/user/tiktoks-average', async ( req, res ) => {
	const username = req.query.username;
	const userObject = await getUserInfo(username);
	res.send(userObject);
})

// Get Total Views Monthly
router.get('/user/tiktoks-total', async ( req, res ) => {
	const username = req.query.username;
	const userObject = await getUserInfo(username);
	res.send(userObject);
})


export default router
