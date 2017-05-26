import * as chalk from 'chalk';
import * as express from 'express';
import * as parseArgs from 'minimist';
import * as webpack from 'webpack';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
import * as webpackHotMiddleware from 'webpack-hot-middleware';

import webpackConfig from '../webpack.config.babel';
import renderApp from './renderApp';

const args = parseArgs(process.argv.slice(2));

// When HMR updates occur the webpack middlewares must be persisted
const reusedMiddlewares = [];

// Set up the middlewares to serve the Javascript bundle
const clientConfig = webpackConfig({
	target: 'client',
	watch: args.liveClientBundle,
	hotClient: args.hotClient,
});

if (args.liveClientBundle) {
	console.info('serving client bundle from memory');

	// webpack-dev/hot-middleware need to share a compiler
	const clientCompiler = webpack(clientConfig);

	reusedMiddlewares.push(
		webpackDevMiddleware(clientCompiler, {
			publicPath: clientConfig.output.publicPath,
			stats: { colors: true },
		}),
	);

	if (args.hotClient) {
		reusedMiddlewares.push(webpackHotMiddleware(clientCompiler));
	}
} else {
	console.info('serving client bundle statically');
	reusedMiddlewares.push(express.static(clientConfig.output.path));
}

// start listening to http requests
const server = express();

let router = null;

// instantiates a new router and reuses the existing middlewares
function assembleRouter() {
	console.info('🐠 assembling router');
	router = express.Router();
	router.get('/', renderApp);
	reusedMiddlewares.map(mw => router.use(mw));
}
assembleRouter();

// delegate all requests to the current router
server.use((req, res, next) => {
	router(req, res, next);
});

// recreate the router every time an HMR update occurs
if (module.hot) {
	module.hot.accept('./renderApp', assembleRouter);
}

const port = process.env.PORT || 3000;
const host = process.env.HOST || process.env.IP || 'localhost';

server.listen(port, host, () => {
	console.info(
		'🌮 server started at ' + chalk.blue.underline(`${host}:${port}`),
	);
});
