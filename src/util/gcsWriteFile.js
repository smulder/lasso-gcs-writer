const generateGCSUrl = require('./generateGCSUrl');


module.exports = function gcsWriteFile (params) {
	const { Bucket, Key, contentType, reader, staticUrl, bucketDir, type, storage } = params;

	return new Promise((resolve, reject) => {

		let locBucketDir = '';
		if(bucketDir){
			locBucketDir = bucketDir + '/'
		}

		if(type == 'bundle'){
			let locResult = reader.readBundle().pipe(
				storage
				.bucket(Bucket)
				.file(locBucketDir + Key)
				.createWriteStream({
					gzip: true,
					metadata: {
						contentType: contentType,
						cacheControl: 'public, max-age=31536000'
					}
				})
			).on('error', (err) => {
				console.log('error trying to write bundle', err);
				reject(err);
			}).on('finish', () => {
				resolve(generateGCSUrl(Bucket, Key, staticUrl, locBucketDir));
			});
		}else{
			let locResult = reader.readResource().pipe(
				storage
				.bucket(Bucket)
				.file(locBucketDir + Key)
				.createWriteStream({
					gzip: true,
					metadata: {
						contentType: contentType,
						cacheControl: 'public, max-age=31536000'
					}
				})
			).on('error', (err) => {
				console.log('error trying to write resource', err);
				reject(err);
			}).on('finish', () => {
				resolve(generateGCSUrl(Bucket, Key, staticUrl, locBucketDir));
			});
		}
	})
}
