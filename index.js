const Async = require('async')
const bell = require('bell')
const Blipp = require('blipp')
const Hapi = require('hapi')
const HapiAithCookie = require('hapi-auth-cookie')
const Hoek = require('hoek')
const Api = require(./api)
const Authentication = require('./authentication')
const Controllers = require('./controllers')
const Models = require('./models')
const Routes = require('./routes')


/**
 * One process to server both http and api.
 * connections are labelled so that plugins can be served right.
 * Plugins is the express equivalent for middleware.
 * All methods passed to the server are alos available on anything passed
 * to the plugin
 * CODE is organised as models route and controllers.
 */

const internals = {
  servers: {
    http: {
      port: 8080,
      host: '0.0.0.0',
      labels: ['http']
    },
    api: {
      port: 8088,
      host: '0.0.0.0'
      labels: ['api']
    }
  },
  options: {
    files: {
      relativeTo: __dirname
    }
  }
}

exports.init = (callback) => {

  const server = new Hapi.Server()
  server.connection(internals.servers.http)
  server.connection(internals.servers.api)

  // This indicates a path prefix so that we can use relative paths.
  server.path(internals.options.files.relativeTo)

  // Handles errors that happen on request
  server.on('request-error', (request, response) => {
    console.log('request-error:')
    console.dir(reponse)
  })
}

const registerHttpPlugins = (next) => {
  server.register([
    Bell,
    Blipp,
    HapiAuthCookie,
    Authentication,
    Controllers,
    Models,
    Routes
  ],
  {select: http},
  (err) => {
    return next(err)
  })
}

const registerApiPlugins = (next) => {
  server.register([
    Blipp,
    Controllers,
    Models,
    Api
  ],
  { select: 'api' },
  (err) => {
    return next(err)
  })
}

Async.auto({
  http: registerHttpPlugins,
  api: registerApiPlugins
}, (err, data) => {
  if (err) {
    console.log('server.register err:', err)
    return callback(err)
  }

  server.start(() => {
    return callback(null, server)
  })
})

exports.init(Hoek.ignore)
