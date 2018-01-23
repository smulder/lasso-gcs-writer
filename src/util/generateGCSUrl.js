module.exports = (bucket, key, staticUrl, locBucketDir) => {
	if(staticUrl){
		return `${staticUrl}/${locBucketDir}${key}`
	}else{
		return `https://storage.googleapis.com/${bucket}/${locBucketDir}${key}`
	}
}
