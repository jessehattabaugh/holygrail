import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';
import React from 'react';

import App from './components/App';

mountApp(App);

if (module.hot) {
	console.log('module.hot');
	module.hot.accept('./components/App', () => {
		console.log('./components/App updated');
		mountApp(App);
	});
}

function mountApp(Component) {
	console.log('mounting app');
	render(
		<AppContainer>
			<Component />
		</AppContainer>,
		document.getElementById('root'),
	);
}

console.log('client started');
