import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import React from 'react';
import { renderToString } from 'react-dom/server';
import parseArgs from 'minimist';

const args = parseArgs(process.argv.slice(2));

import App from './components/App';
import webpackConfig from '../webpack.config.babel';

const server = express();
const clientConfig = webpackConfig({
	target: 'client',
	watch: args.liveClientBundle,
});

const port = process.env.PORT || 3000;
const host = process.env.HOST || process.env.IP || 'localhost';

if (args.liveClientBundle) {
	server.use(
		webpackDevMiddleware(webpack(clientConfig), {
			publicPath: clientConfig.output.publicPath,
			stats: { colors: true },
		})
	);
} else {
	server.use(express.static(clientConfig.output.path));
}

server.get('/', (req, res) => {
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

server.listen(port, host, () => {
	console.info(`🌮 server started at ${host}:${port}`);
});
