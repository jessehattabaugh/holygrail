import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { flushWebpackRequireWeakIds } from 'react-loadable';

import App from './components/App';

const context = {};

function renderApp(req, res) {
	// wrap the app in a server side router
	const RoutedApp = (
		<StaticRouter location={req.url} context={context}>
			<App />
		</StaticRouter>
	);

	// render the app to a string
	const appAsString = renderToString(RoutedApp);

	// build a list of JavaScript files that need to be embedded in the html page
	// https://github.com/60frames/react-boilerplate/blob/13acd6e71f3ec89f10e7c0666b1d574016265da1/src/server.js
	const stats = res.locals.webpackStats.toJson();
	// todo: probably get this from a json file if we aren't dealing with webpack-dev-server

	// get the filename for the main chunk
	let mainAssets = stats.assetsByChunkName['main'];
	const mainFile = mainAssets.find(asset => asset.endsWith('.js'));

	// get the filename for the commons chunk
	let commonsAssets = stats.assetsByChunkName['commons'];
	const commonsFile = commonsAssets.find(asset => asset.endsWith('.js'));

	// get the filenames for the chunks used in the render
	const weakIdsUsedInRender = flushWebpackRequireWeakIds();
	console.info('weakIdsUsedInRender', weakIdsUsedInRender);
	const filesUsedInRender = weakIdsUsedInRender.reduce(
		(renderFiles, weakId) => {
			const moduleForWeakId = stats.modules.find(mod => mod.id == weakId);
			console.info('moduleForWeakId', moduleForWeakId);
			if (!moduleForWeakId)
				throw new Error(`weakId ${weakId} not found in stats`);
			const filesForModule = moduleForWeakId.chunks
				.reduce((moduleFiles, chunkId) => {
					const chunkForModule = stats.chunks.find(
						chunk => chunk.id == chunkId,
					);
					console.info('chunkForModule', chunkForModule);
					const filesForChunk = chunkForModule.files.filter(
						chunkFile =>
							chunkFile.endsWith('.js') &&
							!chunkFile.endsWith('.hot-update.js') &&
							!moduleFiles.includes(chunkFile),
					);
					console.info('filesForChunk', filesForChunk);
					return moduleFiles.concat(filesForChunk);
				}, [])
				.filter(moduleFile => !renderFiles.includes(moduleFile));
			console.info('filesForModule', filesForModule);
			return renderFiles.concat(filesForModule);
		},
		[],
	);
	console.info('filesUsedInRender', filesUsedInRender);

	// embed script tags for the chunks
	const scriptTags = [commonsFile, ...filesUsedInRender, mainFile]
		.map(file => `<script src="${file}"></script>`)
		.join('');

	let styleTags = '';

	const html = `<!DOCTYPE html>
	<html>
		<head>
			<meta charset="utf-8" />
			<title>Cards</title>
			${styleTags}
		</head>
		<body>
			<div id="root">${appAsString}</div>
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
