// NOTE changes to this file will require a restart

import http from 'http';

import app from './server.app.js';

const server = http.createServer(app);

const port = process.env.PORT || 3000;
const host = process.env.HOST || process.env.IP || 'localhost';

server.listen(port, host, () => {
	console.info(`🌮 server started at ${host}:${port}`);
});

let currentApp = app;
if (module.hot) {
	module.hot.accept('./server.app.js', () => {
		server.removeListener('request', currentApp);
		server.on('request', app);
		currentApp = app;
	});
}
