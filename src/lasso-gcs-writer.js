//const AWS = require('aws-sdk')
const mime = require('mime')
const conflogger = require('conflogger')
const readResource = require('./util/readResource')
const readBundle = require('./util/readBundle')
const calculateChecksum = require('./util/calculateChecksum')
const getS3UrlIfExists = require('./util/getS3UrlIfExists')
const gcsWriteFile = require('./util/gcsWriteFile')
const createBucketIfNotExist = require('./util/createBucketIfNotExist')



async function uploadFile ({ staticUrl, bucket, reader, file, contentType, calculateKey }) {
  const key = (calculateKey && calculateKey(file)) || calculateChecksum(file)
  const params = { Bucket: bucket, Key: key, reader: reader, contentType: contentType, staticUrl: staticUrl }

  // Check whether the file already exists in S3
  //let url = await getS3UrlIfExists(s3, params)
  // TODO write GCS check if url exists method

  if (!url) {
    url = await gcsWriteFile({
      ...params
    })
  }

  return url
}

/**
* @param pluginConfig {Object}
*  pluginConfig.bucket {String} - Name of the GCS bucket to upload to
*  pluginConfig.projectID {String} (optional) - name of the GCS Project ID, needed if creating a new bucket
*  pluginConfig.staticUrl {String} (optional) - if you have a static url on your bucket, provide it here (with http:// | https://). Include any folders at end of url
*  pluginConfig.calculateKey {Function} (optional) - A function to calculate a unique key for each bundle or resource. Defaults to using `sha1` checksum.
*  pluginConfig.readTimeout {Number} (optional) - The maximum amount of time to wait for a file to be read. Defaults to 30 seconds.
*  pluginConfig.logger {Object} (optional) - Logger to write logs to. Does not log if not specified.
*/
module.exports = function (pluginConfig) {
  let {
    projectID,
    bucket,
    staticUrl,
    calculateKey,
    readTimeout,
    logger
  } = pluginConfig || {}

  if (!bucket) throw new Error('"bucket" is a required property of "lasso-gcs-writer"')

  logger = conflogger.configure(logger)

  let bucketConfig

  if (typeof bucket === 'object') {
    bucketConfig = bucket
    bucket = bucketConfig.Bucket
  } else {
    bucketConfig = { Bucket: bucket }
  }



  return {
    async init (lassoContext) {
      //await createBucketIfNotExist(s3, bucketConfig, logger)
	 // TODO implement a create if not exist bucket method
    },
    /**
     * This will be called for JS and CSS bundles
     */
    async writeBundle (reader, lassoContext, callback) {
      try {
        const bundle = lassoContext.bundle
        const contentType = mime.getType(bundle.contentType)
        //const file = await readBundle(reader, bundle.name, readTimeout)
	   const url = await uploadFile({ bucket, reader, contentType, calculateKey, staticUrl });
        //const url = await uploadFile({ bucket, file, contentType, calculateKey })
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
        const path = lassoContext.path
        const contentType = mime.getType(path)
        //const file = await readResource(reader, path, readTimeout)
        const url = await uploadFile({ bucket, reader, contentType, calculateKey, staticUrl })
        if (callback) return callback(null, { url })
        return { url }
      } catch (err) {
        if (callback) return callback(err)
        throw err
      }
    }
  }
}