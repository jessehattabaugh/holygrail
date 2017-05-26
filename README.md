# cards

flashcard PWA

## goals

* fast
* maintainable
* installable
* offline capable
* server side rendered
* unit tested
* end-to-end tested
* hot module replacement

## scripts

* `npm run start-dev` - starts a development web server
* `npm run lint` - lints code
* `npm run format` - formats code
* `npm run bundle-server` - bundles the server for running in node
* `npm run bundle-client` - bundles the client for running in browser
* `npm run kill` - kills all node and npm processes (for EADDRINUSE)

## environment variables

* `NODE_ENV` - switches between `development` and `production` mode
* `HOST` or `IP` - the hostname or ip address the server will bind to
* `PORT` - the port number the server will bind to

## problems

* changes to webpack.config don't take effect until restart (maybe unavoidable)
* ES6 apis are not polyfilled
* no router for handling urls, probably gonna use React Router
* no state management, probably gonna use Redux
* main chunk is already pretty big even with very little app code. This is can be fixed by moving react and friends to a vendor chunk
* there are no tests to ensure the build system works
* `client.bundle.js` is hardcoded in the html, it could come from the webpack.config
* production version isn't minified
