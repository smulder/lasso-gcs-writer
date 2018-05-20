const mime = require('mime');
const conflogger = require('conflogger');
const readResource = require('./util/readResource');
const readBundle = require('./util/readBundle')
const calculateChecksum = require('./util/calculateChecksum');
const getGCSUrlIfExists = require('./util/getGCSUrlIfExists')
const gcsWriteFile = require('./util/gcsWriteFile');
const createBucketIfNotExist = require('./util/createBucketIfNotExist');
const Storage = require('@google-cloud/storage');
const storage = new Storage();


async function uploadFile ({ staticUrl, staticUrlArray, step, bucket, reader, contentType, bucketDir, key, type }) {

  const params = { Bucket: bucket, Key: key, keyCache, keyCache, reader: reader, contentType: contentType, staticUrl: staticUrl, staticUrlArray: staticUrlArray, step: step, bucketDir: bucketDir, type: type, storage: storage };

  // Check whether the file already exists in Google Cloud Storage
  let url = await getGCSUrlIfExists(params);

  if (!url) {
    try{
	    url = await gcsWriteFile({
	      ...params
	 });
    }catch(e){
	    console.log('error trying to write gcsFile to bucket:', e);
    }

  }

  return url
}

/**
* @param pluginConfig {Object}
*  pluginConfig.bucket {String} - Name of the GCS bucket to upload to
*  pluginConfig.projectID {String} (optional) - name of the GCS Project ID, needed if creating a new bucket
*  pluginConfig.bucketDir {String} (optional) - subdirectory path to wright to on bucket.
*  pluginConfig.staticUrl {String} (optional) - if you have a static url on your bucket, provide it here (with http:// | https://). Include any folders at end of url
*  pluginConfig.calculateKey {Function} (optional) - A function to calculate a unique key for each bundle or resource. Defaults to using `sha1` checksum.
*  pluginConfig.readTimeout {Number} (optional) - The maximum amount of time to wait for a file to be read. Defaults to 30 seconds.
*  pluginConfig.logger {Object} (optional) - Logger to write logs to. Does not log if not specified.
*/

module.exports = function (pluginConfig) {
  let {
    projectID,
    config,
    bucket,
    bucketDir,
    staticUrl,
    staticUrlArray,
    calculateKey,
    readTimeout,
    logger
  } = pluginConfig || {}

  var step = 0;
  // key : staticUrl
  var keyCache = {};

  if (!bucket) throw new Error('"bucket" is a required property of "lasso-gcs-writer"')

  logger = conflogger.configure(logger);

  let bucketConfig;

  if (typeof bucket === 'object') {
    bucketConfig = bucket;
    bucket = bucketConfig.Bucket;
  } else {
    bucketConfig = { Bucket: bucket };
  }



  return {
    async init (lassoContext) {
      //await createBucketIfNotExist(s3, bucketConfig, logger)
    },
    /**
     * This will be called for JS and CSS bundles
     */
    async writeBundle (reader, lassoContext, callback) {
      try {

        const bundle = lassoContext.bundle;
	   //console.log('bundle', bundle);
        const contentType = mime.getType(bundle.contentType);
	   let chunks = await readBundle(reader, bundle);

	   let pathParts = bundle.name.split('/');
	   let endFolder = pathParts[pathParts.length-2];
	   if(!endFolder){
		   endFolder = '';
	   }else{
		   endFolder += '-';
	   }
	   let ext = contentType.split('/').pop() == "css" ? "css" : "js";
	   let key = (calculateKey && calculateKey(chunks)) || calculateChecksum(chunks) + '.' + ext;

	   if(staticUrlArray && staticUrlArray.length && step < staticUrlArray.length && !keyCache[key]){
		   step++;
	   }else if(!keyCache[key]){
		   step = 0;
	   }

	   const url = await uploadFile({ bucket, reader, contentType, staticUrl, staticUrlArray, step, bucketDir, key, keyCache, type:'bundle' });
        bundle.url = url
        if (callback) return callback()
      } catch (err) {
        if (callback) return callback(err)
        throw err
      }
    },

    /**
     * This will be called for front-end assets such as images, fonts, etc.
     */
    async writeResource (reader, lassoContext, callback) {
      try {
	   //console.log('lassoContext', lassoContext);
        const path = lassoContext.path
        const contentType = mime.getType(path)
	   let chunks = await readResource(reader);
	   let key = (calculateKey && calculateKey(chunks)) || calculateChecksum(chunks) + '-' + path.split('/').pop();
        const url = await uploadFile({ bucket, reader, contentType, staticUrl, staticUrlArray, step, bucketDir, key, keyCache, type:'resource' });
        if (callback) return callback(null, { url })
        return { url }
      } catch (err) {
        if (callback) return callback(err)
        throw err
      }
    }
  }
}
