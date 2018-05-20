const generateGCSUrl = require('./generateGCSUrl')

module.exports = async function getGCSUrlIfExists(params) {
	return new Promise((resolve, reject) => {
		const { Bucket, Key, contentType, reader, staticUrl, staticUrlArray, step, bucketDir, type, storage } = params;

		let locBucketDir = ''
		if(bucketDir){
			locBucketDir = bucketDir + '/'
		}

		storage
		.bucket(Bucket)
		.file(locBucketDir + Key)
		.exists()
		.then((result) => {

			if(result && result[0]){
				resolve(generateGCSUrl(Bucket, Key, staticUrl, locBucketDir, staticUrlArray, step));
			}else{
				//console.log('file: ' + staticUrl + '/' + locBucketDir + '/' + Key + ' ----- did not exist');
				resolve(null);
			}
		}).catch((e) => {
			console.log('Error while checking if file exists in bucket: ', e);
			//reject(e);
		});


	})
}
