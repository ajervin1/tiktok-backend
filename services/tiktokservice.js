/* This file holds all the functionality of interacting with the scraper */
import axios from 'axios'
import SignTok from "signtok";
import querystring from "querystring";
import { convertUnixTimestamp } from "../utils/helpers.js";
import { uploadImage } from "../utils/imageupload.js";


// Stable msToken that seems to work consistently
const msToken = "YkuQ8qGabOtryQ7k8cFpR9supZ_XCgRM2oY0mwT3xBs73yQ8vj74DPmFtX1eF83f-Zq9tTZtG0CvBeiHmjonGRVjYn5zBEQME21ytbSDbgRXpbl5LONHaysuwms9FBYwks3JTeeluaic"
const COUNT = 20

/**
 * Get all tiktoks associated to a user id
 * @param userId secUid of the user you want to scrape
 * @param cursor the page at which you want to scrape the data
 */
export async function getTikTokByUserId( userId = "MS4wLjABAAAAL4SwMC2HkCB1V8GUN9EVHnye1-IMQwbte0msHk8lSSQ", cursor = 0 ) {
	// This the final URL you make a request to for the API call, it is ALWAYS this, do not mistaken it for the signed URL
	const TT_REQ_PERM_URL = "https://www.tiktok.com/api/post/item_list/?WebIdLastTime=1684959661&aid=1988&app_language=en&app_name=tiktok_web&browser_language=en-US&browser_name=Mozilla&browser_online=true&browser_platform=Win32&browser_version=5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F123.0.0.0%20Safari%2F537.36%20Edg%2F123.0.0.0&channel=tiktok_web&cookie_enabled=true&count=35&coverFormat=2&cursor=0&device_id=7236846595559933467&device_platform=web_pc&focus_state=true&from_page=user&history_len=8&is_fullscreen=false&is_page_visible=true&language=en&os=windows&priority_region=RO&referer=https%3A%2F%2Fwww.tiktok.com%2Fbusiness-suite%2Fmessages%3Ffrom%3Dhomepage%26lang%3Den&region=RO&root_referer=https%3A%2F%2Fwww.tiktok.com%2Fbusiness-suite%2Fmessages%3Ffrom%3Dhomepage%26lang%3Den&screen_height=1080&screen_width=1920&secUid=MS4wLjABAAAATdiadghBG5ZZqRrY93j0-jyzqPW_toWf5ir6b9aeB64HebodSB1scEXNpC020bPq&tz_name=Europe%2FBucharest&verifyFp=verify_lv1bd0o8_AA3QC5jZ_70uk_4haw_BYSy_P6oIpsr0LMUE&webcast_language=en&msToken=riqlJPr42AMSGAwHu9g9z5PhCqn3Hzp-CjRpNH8XqPTcwNCehHnQqvP5BAgx7HwkuQfAcVxbttMfK3fGHZvUXYB__GZK7iWaYaItDzaDJxeVock0JIurABWe1b5T30PY61UM&X-Bogus=DFSzswVurstANHsMt5bgOw4m8iGH&_signature=_02B4Z6wo00001tPwkyAAAIDBIzv5q2eTgMbT8JeAANLu81";
	const apiUrl = `https://www.tiktok.com/api/post/item_list/?`
	const PARAMS = {
		msToken,
		count: COUNT,
		device_id: '7165118680723998211',
		secUid: userId,
		cursor: cursor,
	};
	const parsedUrl = new URL(TT_REQ_PERM_URL);
	const parsedQuery = querystring.parse(parsedUrl.search.slice(1));
	const mergedParams = { ...parsedQuery, ...PARAMS };
	const { signature, navigator } = await signTokRequest(apiUrl, TT_REQ_PERM_URL, mergedParams)
	const { "x-tt-params": xTtParams, signed_url } = signature;
	const { user_agent: userAgent } = navigator;
	// Scrape TikTok Data
	const res = await tiktokRequest({ userAgent, xTtParams, signed_url });
	const { data } = res;
	let tiktoks = data.itemList.map(async doc => {
		const dynamicCover = await uploadImage(doc.video.cover, doc.id);
		doc.video.dynamicCover = dynamicCover;
		return {
			...doc,
			_id: doc.id,
			createdAt: convertUnixTimestamp(doc.createTime),

		};
	})
	tiktoks = await Promise.all(tiktoks);
	return { newCursor: data.cursor, hasMore: data.hasMore, tiktoks }
}


/**
 * Get userInfo of a TikTok User
 * @param username secUid of the user you want to scrape
 */
export async function getUserInfo( username = 'avajustin' ) {
	const apiUrl = `https://www.tiktok.com/api/user/detail?`
	const TT_REQ_PERM_URL_USERINFO = "https://www.tiktok.com/api/user/detail/?WebIdLastTime=1684959661&abTestVersion=%5Bobject%20Object%5D&aid=1988&appType=m&app_language=en&app_name=tiktok_web&browser_language=en-US&browser_name=Mozilla&browser_online=true&browser_platform=Win32&browser_version=5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F123.0.0.0%20Safari%2F537.36%20Edg%2F123.0.0.0&channel=tiktok_web&cookie_enabled=true&device_id=7236846595559933400&device_platform=web_pc&focus_state=true&from_page=user&history_len=8&is_fullscreen=false&is_page_visible=true&language=en&os=windows&priority_region=RO&referer=https%3A%2F%2Fwww.tiktok.com%2Fbusiness-suite%2Fmessages%3Ffrom%3Dhomepage%26lang%3Den&region=RO&root_referer=https%3A%2F%2Fwww.tiktok.com%2Fbusiness-suite%2Fmessages%3Ffrom%3Dhomepage%26lang%3Den&screen_height=1080&screen_width=1920&secUid=&tz_name=Europe%2FBucharest&uniqueId=&user=%5Bobject%20Object%5D&verifyFp=verify_lv1bd0o8_AA3QC5jZ_70uk_4haw_BYSy_P6oIpsr0LMUE&webcast_language=en&msToken=gGkV_K79_CgoknlGzARe-cvv4ZSaZef9sjd_u6jSxLNHchbi_ZF9hPG_35EoQcHxHDAJkb4dDW9gec1CKXWV3ELFQ6bVUUSQBsj1Vfi_feLstK-6SHMxJMVc-Zvm6xA9AMUG&X-Bogus=DFSzswVue6zANHsMt5bgO74m8icv&_signature=_02B4Z6wo00001Xk8yMwAAIDCifeiRAutXwV5PMxAADhW65";

	const params = { uniqueId: username }
	const parsedUrl = new URL(TT_REQ_PERM_URL_USERINFO);
	const parsedQuery = querystring.parse(parsedUrl.search.slice(1));
	const mergedParams = { ...parsedQuery, ...params };

	const { signature, navigator } = await signTokRequest(apiUrl, TT_REQ_PERM_URL_USERINFO, mergedParams)
	const { "x-tt-params": xTtParams, signed_url } = signature;
	const { user_agent: userAgent } = navigator;
	// Scrape TikTok Data
	const res = await tiktokRequest({ userAgent, xTtParams, signed_url });
	const { data } = res;
	const { userInfo } = data;
	const { stats, user } = userInfo;
	const { avatarLarger, nickname, signature: sig, uniqueId, secUid } = user
	const avatarUrl = await uploadImage(avatarLarger, uniqueId);
	const userObject = { ...stats, avatarLarger: avatarUrl, nickname, sig, uniqueId, userId: secUid }
	return userObject
}

/* Helper Functions */
export async function tiktokRequest( { userAgent, xTtParams, signed_url } ) {
	const options = {
		headers: {
			"user-agent": userAgent,
			"x-tt-params": xTtParams,
		},
	};
	return axios.get(signed_url, options)
}

export async function signTokRequest( apiUrl, tiktokUserAgent, params ) {
	const signer = new SignTok(tiktokUserAgent);
	const qsObject = new URLSearchParams(params);
	const qs = qsObject.toString();
	const unsignedUrl = `${ apiUrl }${ qs }`;
	const signature = signer.sign(unsignedUrl)
	const navigator = signer.navigator();
	return { signature, navigator }
}