import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import parseArgs from 'minimist';
import React from 'react';
import { renderToString } from 'react-dom/server';

import App from './components/App';
import webpackConfig from '../webpack.config.babel';

const args = parseArgs(process.argv.slice(2));
const server = express();

const webpackCompiler = webpack(webpackConfig({ target: 'client' }));

server.use(
	webpackDevMiddleware(webpackCompiler, {
		publicPath: '/',
	}),
);

server.get('/', (req, res) => {
	res.send(`<!DOCTYPE html>
<html>
	<head>
		<title>StudyNew</title>
	</head>
	<body>
		<div id="root">${renderToString(<App />)}</div>
		<script src="client.js"></script>
	</body>
</html>`);
});

server.listen(args.port, args.host, () => {
	console.info(`server started at ${args.host}:${args.port}`);
});

if (module.hot) {
	module.hot.accept('./components/App', function() {
		console.log(arguments);
	});
}
