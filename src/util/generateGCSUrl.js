module.exports = (bucket, key, staticUrl, locBucketDir) => {
	if(staticUrl){
		return `${staticUrl}/${locBucketDir}${key}`
	}else{
		// Replace with default GCS bucket link url
		return `https://storage.googleapis.com/${bucket}/${locBucketDir}${key}`
	}
}
