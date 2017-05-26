import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';
import * as React from 'react';

import App from './components/App';

mountApp(App);

if (module.hot) {
	module.hot.accept('./components/App', () => {
		mountApp(App);
	});
}

function mountApp(Component) {
	render(
		<AppContainer>
			<Component />
		</AppContainer>,
		document.getElementById('root'),
	);
}

console.info('client started');
