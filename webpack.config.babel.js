import path from 'path';
import nodeExternals from 'webpack-node-externals';
import ShellPlugin from 'webpack-shell-plugin';
import {
	HotModuleReplacementPlugin,
	//NamedModulesPlugin
} from 'webpack';

const srcPath = path.join(process.cwd(), 'src');

// configuration shared by client and server
const baseConfig = {
	context: srcPath,
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
			},
		],
	},
};

module.exports = (env = {}) => {
	if (env.target == 'server') {
		/* server config **********************************************************/
		console.info('🐬 using the server configuration');
		const serverPlugins = [];

		if (env.runServerAfterBundle) {
			serverPlugins.push(
				new ShellPlugin({
					onBuildStart: 'echo 🦄 bundling server',
					onBuildEnd: `npm run server -- --liveClientBundle${env.hmr ? ' --hmr' : ''}`,
				}),
			);
		}

		return Object.assign(baseConfig, {
			entry: path.join(srcPath, 'server.js'),
			output: {
				filename: 'server.bundle.js',
				path: path.join(process.cwd(), 'server'),
			},
			target: 'node',
			externals: [nodeExternals()],
			watch: !!env.watch,
			plugins: serverPlugins,
		});
	} else if (env.target == 'client') {
		/* client config **********************************************************/
		console.info('🐙 using the client configuration');

		const clientPlugins = [
			new ShellPlugin({
				onBuildStart: 'echo 🍭 bundling client',
				onBuildEnd: 'echo 🐲 done bundling client',
			}),
		];

		const clientEntries = [path.join(srcPath, 'client.js')];

		if (env.hmr) {
			clientPlugins.push(
				new HotModuleReplacementPlugin(),
				//new NamedModulesPlugin(),
			);
			clientEntries.unshift(
				'react-hot-loader/patch',
				'webpack-hot-middleware/client',
			);
		}

		return Object.assign(baseConfig, {
			entry: clientEntries,
			output: {
				filename: 'client.bundle.js',
				path: path.join(process.cwd(), 'client'),
				publicPath: '/',
			},
			watch: !!env.watch,
			plugins: clientPlugins,
		});
	} else {
		throw new Error('must specify target');
	}
};
