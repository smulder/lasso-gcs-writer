# lasso-gcs-writer

A plugin for [`lasso`](https://github.com/lasso-js/lasso) that will
upload bundles and resources to Google Cloud Storage.

> WARNING: `lasso-gcs-writer` should only be used to do Lasso prebuilds
> WARNING: `lasso-gcs-writer` is currently completely untested

## Usage

```js
require('lasso').configure({
  plugins: [
    {
      plugin: 'lasso-gcs-writer',
      config: {
        bucket: 'my-awesome-s3-bucket/folderToWriteTo',
        staticUrl: 'https://www.iHaveAStaticUrlOnMyBucket.com/folderToWriteTo'
      }
    }
  ],
  ...
});
```

## Configuration Properties

- `bucket` {String|Object} - Name of the GCS bucket to upload to
- `projectID` {Object} (optional)- name of the GCS Project ID, needed if creating a new bucket
- `staticUrl` {Object} (optional) - if you have a static url on your bucket, provide it here (with http:// | https://). Include any folders at end of url
- `calculateKey` {Function} (optional) - A function to calculate a unique key
for each bundle or resource. Defaults to using `sha1` checksum.
- `readTimeout` {Number} (optional) - The maximum amount of time to wait for a
file to be read. Defaults to 30 seconds.
- `logger` {Object} (optional) - Logger to write logs to. Does not log if not specified.
