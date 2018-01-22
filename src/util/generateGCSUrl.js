module.exports = (bucket, key, staticUrl) => {
	if(staticUrl){
		`${staticUrl}/${key}`
	}else{
		// Replace with default GCS bucket link url
		`https://storage.googleapis.com/${bucket}/${key}`
	}
}
