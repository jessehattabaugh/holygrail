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

* changes to webpack.config don't take effect until restart
* changes to server bundle don't take effect until restart
* changes to client.js require browser refresh
* ES6 apis are not polyfilled
