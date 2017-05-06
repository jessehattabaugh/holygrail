import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import React from 'react';
import { renderToString } from 'react-dom/server';

import App from './components/App';
import webpackConfig from '../webpack.config.babel';

const server = express();

const webpackCompiler = webpack(webpackConfig({ target: 'client' }));

const port = process.env.port || 3000;
const host = process.env.host || process.env.ip || 'localhost';

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

server.listen(port, host, () => {
	console.info(`server started at ${host}:${port}`);
});
