import React from 'react';
import { renderToString } from 'react-dom/server';

import App from './components/App';

function renderApp(req, res) {
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
}

export default renderApp;
