const path = require('path')
module.exports =
{
  webpack(config) {
    config.resolve.modules.push(__dirname)
    return config
  },
  distDir: 'build',
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'my custom header value',
          }
        ],
      },
    ]
  },

}
