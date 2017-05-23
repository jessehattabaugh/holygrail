import path from 'path';
import nodeExternals from 'webpack-node-externals';
import ShellPlugin from 'webpack-shell-plugin';

// configuration shared by client and server
const baseConfig = {
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

const srcPath = path.join(process.cwd(), 'src');

module.exports = (env = {}) => {
	if (env.target == 'server') {
		console.info('🐬 using the server configuration');
		const serverPlugins = [];

		if (env.runServerAfterBundle) {
			serverPlugins.push(
				new ShellPlugin({
					onBuildStart: 'echo 🦄 bundling server',
					onBuildEnd: 'npm run server -- --liveClientBundle',
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
		console.info('🐙 using the client configuration');

		const clientPlugins = [
			new ShellPlugin({
				onBuildStart: 'echo 🍭 bundling client',
				onBuildEnd: 'echo 🏆 done bundling client',
			}),
		];

		return Object.assign(baseConfig, {
			entry: path.join(srcPath, 'client.js'),
			output: {
				filename: 'client.bundle.js',
				path: path.join(process.cwd(), 'client'),
				publicPath: '/',
			},
			plugins: clientPlugins,
		});
	} else {
		throw new Error('must specify target');
	}
};
