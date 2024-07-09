import axios from 'axios';
import fs from 'fs';
import { promisify } from 'util';
import stream from 'stream';

const pipeline = promisify(stream.pipeline);

const imageUrl = "https://p16-pu-sign-useast8.tiktokcdn-us.com/obj/tos-useast8-p-0068-tx2/e568c390e61c4c66ad67c2f7e8bfc300_1720464571?lk3s=81f88b70&nonce=25540&refresh_token=03416255b9de39a38bf1e3a3caba884d&x-expires=1720656000&x-signature=1y2v1VSKc0b5Tdis72X1DXY7GZo%3D&shp=81f88b70&shcp=-";
const filePath = './dynamicCovers/';

export async function downloadImage( url, folderPath, id ) {
	const filename = `${folderPath}/${id}.webp`;
	const response = await axios({
		url,
		method: 'GET',
		responseType: 'stream'
	});

	await pipeline(response.data, fs.createWriteStream(filename));
	console.log("Done Downloading")

}

downloadImage(imageUrl, filePath, "234832098093843");