module.exports = (bucket, key, staticUrl) => {
	if(staticUrl){
		return `${staticUrl}/${key}`
	}else{
		// Replace with default GCS bucket link url
		return `https://storage.googleapis.com/${bucket}/${key}`
	}
}
