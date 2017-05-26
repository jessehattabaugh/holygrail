import path from 'path';
import nodeExternals from 'webpack-node-externals';
import ShellPlugin from 'webpack-shell-plugin';
import {
	HotModuleReplacementPlugin,
	//NoEmitOnErrorsPlugin,
	NamedModulesPlugin,
} from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';

const srcPath = path.join(process.cwd(), 'src');
const outputDir = 'dist';

module.exports = (env = {}) => {
	/* configuration shared by client and server **********************************/
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

	if (env.target == 'server') {
		/* server config **********************************************************/
		console.info('🐬 using the server configuration');
		const serverPlugins = [];
		const serverOutputPath = path.join(process.cwd(), outputDir, 'server');

		if (env.runServerAfterBundle) {
			serverPlugins.push(
				new ShellPlugin({
					onBuildStart: 'echo 🦄 bundling server',
					onBuildEnd: `npm run server -- --liveClientBundle${env.hotClient ? ' --hotClient' : ''}`,
				})
			);
		}

		const serverEntries = [path.join(srcPath, 'server.entry.js')];

		if (env.hotServer) {
			serverEntries.unshift('webpack/hot/poll?1000');
			serverPlugins.push(
				new CleanWebpackPlugin([serverOutputPath], { watch: !!env.watch }),
				new HotModuleReplacementPlugin(),
				//new NoEmitOnErrorsPlugin(),
				new NamedModulesPlugin(),
			);
		}

		return Object.assign(baseConfig, {
			entry: serverEntries,
			output: {
				filename: 'server.bundle.js',
				path: serverOutputPath,
			},
			target: 'node',
			externals: [
				nodeExternals({
					whitelist: ['webpack/hot/poll?1000'],
				}),
			],
			watch: !!env.watch,
			plugins: serverPlugins,
		});
	} else if (env.target == 'client') {
		/* client config **********************************************************/
		console.info('🐙 using the client configuration');

		const clientOutputPath = path.join(process.cwd(), outputDir, 'client');

		const clientPlugins = [
			new CleanWebpackPlugin([clientOutputPath], { watch: !!env.watch }),
			new ShellPlugin({
				onBuildStart: 'echo 🍭 bundling client',
				onBuildEnd: 'echo 🐲 done bundling client',
			}),
		];

		const clientEntries = [path.join(srcPath, 'client.entry.js')];

		if (env.hotClient) {
			clientPlugins.push(
				new HotModuleReplacementPlugin(),
				//new NoEmitOnErrorsPlugin(),
				new NamedModulesPlugin()
			);
			clientEntries.unshift(
				'react-hot-loader/patch',
				'webpack-hot-middleware/client'
			);
		}

		return Object.assign(baseConfig, {
			entry: clientEntries,
			output: {
				filename: 'client.bundle.js',
				path: clientOutputPath,
				publicPath: '/',
			},
			watch: !!env.watch,
			plugins: clientPlugins,
		});
	} else {
		throw new Error('must specify target');
	}
};
