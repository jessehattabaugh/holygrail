import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';

import App from './components/App';

const context = {};

function renderApp(req, res) {
	let scriptTags = '<script id="default" src="client.bundle.js"></script>';

	let styleTags = '';

	const RoutedApp = (
		<StaticRouter location={req.url} context={context}>
			<App />
		</StaticRouter>
	);

	const html = `<!DOCTYPE html>
	<html>
		<head>
			<meta charset="utf-8" />
			<title>Cards</title>
			${styleTags}
		</head>
		<body>
			<div id="root">${renderToString(RoutedApp)}</div>
			${scriptTags}
		</body>
	</html>`;

	// Handle any redirects that might have happened while rendering the App
	if (context.url) {
		res.writeHead(302, {
			Location: context.url,
		});
		res.end();
	} else {
		res.write(html);
		res.end();
	}
}

export default renderApp;
