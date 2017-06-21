# holygrail

So you want to render your React components on the server and client, for a fast first render, and so that search spiders don't have to execute Javascript to see content. That's reasonable. You also want to use hot module replacement so that development is frictionless. That's understandable. You want to do both those things at the same time? Buckle up cause this is gonna be a bumpy ride.

## goals

* [x] server side rendering
* [x] hot module replacement with `react-hot-loader`
* [x] lazy loading components with `react-loadable`
* [x] url routing with `react-router`
* [x] linting with `eslint`
* [x] formatting with `prettier`
* [x] type checking with `typescript`

## scripts

* `npm run start-dev` - starts a development web server
* `npm run lint` - lints code
* `npm run format` - formats code
* `npm run bundle-server` - bundles the server for running in node
* `npm run bundle-client` - bundles the client for running in browser
* `npm run kill` - kills all node and npm processes (for `EADDRINUSE`)

## environment variables

* `NODE_ENV` - switches between `development` and `production` mode
* `HOST` or `IP` - the hostname or ip address the server will bind to
* `PORT` - the port number the server will bind to

## problems

* no router for handling urls, probably gonna use React Router
* ES6 apis are not polyfilled
* no state management, probably gonna use Redux
* main chunk is already pretty big even with very little app code. This is can be fixed by moving react and friends to a vendor chunk
* there are no tests to ensure the build system works
* `client.bundle.js` is hardcoded in the html, it could come from the webpack.config
* production version isn't minified
* prettier formats the build products which is unnecessary
* changes to webpack.config don't take effect until restart (maybe unavoidable)
* no CSS handling
* old build products are never cleaned out
* express server might be missing some headers for security maybe use https://www.npmjs.com/package/helmet
* chunk filenames don't change between builds so they may get cached, should append hash of the file to the name so that they change when the chunk contents change
* there is no favicon
* babel doesn't cache it's output, setting cacheDirectory could speed this up
