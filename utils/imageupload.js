import { v2 as cloudinary } from 'cloudinary';

export async function uploadImage(imageUrl,imageId) {
	// Configuration
	cloudinary.config({
		cloud_name: 'dqkacquke',
		api_key: '686774672315868',
		api_secret: '0IT-O8_oDhwjJP0sieJJ2_EICEg' // Click 'View Credentials' below to copy your API secret
	});

	// Upload an image
	const uploadResult = await cloudinary.uploader.upload(imageUrl, {
			public_id: imageId,
		}
	)
	const uploadUrl = uploadResult.url;
	// Save this url to database
	return uploadUrl
}
