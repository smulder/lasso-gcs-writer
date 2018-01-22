const lassoGCSWriter = require('./src/lasso-gcs-writer')

module.exports = function (lasso, pluginConfig) {
  lasso.config.writer = lassoGCSWriter(pluginConfig)
}
