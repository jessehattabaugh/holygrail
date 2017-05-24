import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import React from 'react';
import { renderToString } from 'react-dom/server';
import parseArgs from 'minimist';

const args = parseArgs(process.argv.slice(2));

import App from './components/App';
import webpackConfig from '../webpack.config.babel';

const serverApp = express();
const clientConfig = webpackConfig({
	target: 'client',
	watch: args.liveClientBundle,
	hotClient: args.hotClient,
});

if (args.liveClientBundle) {
	console.info('serving client bundle from memory');
	const clientCompiler = webpack(clientConfig);
	serverApp.use(
		webpackDevMiddleware(clientCompiler, {
			publicPath: clientConfig.output.publicPath,
			stats: { colors: true },
		}),
	);
	if (args.hotClient) {
		serverApp.use(webpackHotMiddleware(clientCompiler));
	}
} else {
	console.info('serving client bundle statically');
	serverApp.use(express.static(clientConfig.output.path));
}

serverApp.get('/', (req, res) => {
	res.send(`<!DOCTYPE html>
<html>
	<head>
		<title>StudyNew</title>
	</head>
	<body>
		<div id="root">${renderToString(<App />)}</div>
		<script src="client.bundle.js"></script>
	</body>
</html>`);
});

export default serverApp;
