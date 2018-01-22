const generateGCSUrl = require('./generateGCSUrl');
const Storage = require('@google-cloud/storage');
const storage = new Storage();

module.exports = function gcsWriteFile (params) {
	const { Bucket, Key, ContentType, reader, staticUrl } = params;

	return new Promise((resolve, reject) => {

		let locResult = reader.readBundle().pipe(
			storage
			.bucket(Bucket)
			.file(Key)
			.createWriteStream({
				gzip: true,
				metadata: {
					contentType: ContentType
				}
			})
		).on('error', (err) => {
			reject(err);
		}).on('finish', () => {
			console.log('locResult', locResult);
			resolve(generateGCSUrl(Bucket, Key, staticUrl));
		});
	})
}
