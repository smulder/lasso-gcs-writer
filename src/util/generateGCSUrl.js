module.exports = (bucket, key, staticUrl, locBucketDir, staticUrlArray, step, keyCache) => {

	if(staticUrlArray && staticUrlArray.length){
		if(keyCache[key]){
			staticUrl = keyCache[key];
		}else{
			staticUrl = staticUrlArray[step];
			keyCache[key] = staticUrl;
		}

		return `${staticUrl}/${locBucketDir}${key}`
	}else if(staticUrl){
		return `${staticUrl}/${locBucketDir}${key}`
	}else{
		return `https://storage.googleapis.com/${bucket}/${locBucketDir}${key}`
	}
}
