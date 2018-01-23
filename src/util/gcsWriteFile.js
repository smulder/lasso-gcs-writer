const generateGCSUrl = require('./generateGCSUrl');
const Storage = require('@google-cloud/storage');
const storage = new Storage();

module.exports = function gcsWriteFile (params) {
	const { Bucket, Key, contentType, reader, staticUrl, bucketDir } = params;

	return new Promise((resolve, reject) => {

		let locBucketDir = ''
		if(bucketDir){
			locBucketDir = bucketDir + '/'
		}

		let locResult = reader.readBundle().pipe(
			storage
			.bucket(Bucket)
			.file(locBucketDir + Key)
			.createWriteStream({
				gzip: true,
				metadata: {
					contentType: contentType
				}
			})
		).on('error', (err) => {
			reject(err);
		}).on('finish', () => {
			resolve(generateGCSUrl(Bucket, Key, staticUrl));
		});
	})
}
