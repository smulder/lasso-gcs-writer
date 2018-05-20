module.exports = (bucket, key, staticUrl, locBucketDir, staticUrlArray, step) => {

	if(staticUrlArray && staticUrlArray.length){
		staticUrl = staticUrlArray[step];
		return `${staticUrl}/${locBucketDir}${key}`
	}else if(staticUrl){
		return `${staticUrl}/${locBucketDir}${key}`
	}else{
		return `https://storage.googleapis.com/${bucket}/${locBucketDir}${key}`
	}
}
