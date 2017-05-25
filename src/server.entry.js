import chalk from 'chalk';
import express from 'express';
import parseArgs from 'minimist';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config.babel';
import renderApp from './renderApp';

const args = parseArgs(process.argv.slice(2));
const link = chalk.blue.underline;

// set up middlewares to serve the javascript bundle
const clientConfig = webpackConfig({
	target: 'client',
	watch: args.liveClientBundle,
	hotClient: args.hotClient,
});

const reusedMiddlewares = [];

if (args.liveClientBundle) {
	console.info('serving client bundle from memory');

	// webpack-dev/hot-middleware need to share a compiler
	const clientCompiler = webpack(clientConfig);
	reusedMiddlewares.push(webpackDevMiddleware(clientCompiler, {
		publicPath: clientConfig.output.publicPath,
		stats: { colors: true },
		serverSideRender: true,
	}));
	if (args.hotClient) {
		reusedMiddlewares.push(webpackHotMiddleware(clientCompiler));
	}
} else {
	console.info('serving client bundle statically');
	reusedMiddlewares.push(express.static(clientConfig.output.path));
}

// start listening to http requests
const server = express();
let router = express.Router();
assembleRouter();

server.use((req, res, next) => {
	router(req, res, next);
});

const port = process.env.PORT || 3000;
const host = process.env.HOST || process.env.IP || 'localhost';

server.listen(port, host, () => {
	console.info('🌮 server started at ' + link(`${host}:${port}`));
});



if (module.hot) {
	module.hot.accept('./renderApp', assembleRouter);
}

function assembleRouter() {
	router = express.Router();
	router.get('/', renderApp);
	reusedMiddlewares.map(mw => router.use(mw));
}
