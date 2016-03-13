const Glue = require('glue')
const hapi = require('hapi')

const internals = {
  manifest: {
    connnections: [{
      port: 8080,
      label: ['http']
    },
    {
      port: 8088,
      label: ['api']
    }],
    plugins: {
      bell: [{'select': 'http'}],
      blipp: [{}],
      'hapi-auth-cookie': [{'select': 'http'}],
      './authentication': [{'select': 'http'}],
      './controllers': [{'select': ['http', 'api']}],
      './models': [{'select: ['http', 'api']'}],
      './routes': [{'select': ['http']}]
      './api': [{'select': ['api']}],
      good: {
        opsInterval: 5000,
        reporters: [{
          'reporter': 'good-console',
          'events': {'ops': '*', 'log': '*'}
        }]
      }
    }
  }
}

Glue.compose(internals.manifest, {relativeTo: __dirname}, (err, server) => {
  if (err) {
    console.log('server.register err:', err)
  }
  server.start()
})
