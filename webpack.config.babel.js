import path from 'path';
import nodeExternals from 'webpack-node-externals';

const base = {
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

const srcPath = path.join(__dirname, 'src');
const destPath = path.join(__dirname, 'dest');

module.exports = (env = {}) => {
	if (env.target == 'server') {
		return Object.assign(base, {
			entry: path.join(srcPath, 'server.js'),
			output: {
				filename: 'server.bundle.js',
				path: destPath,
			},
			target: 'node',
			externals: [nodeExternals()],
		});
	} else if (env.target == 'client') {
		return Object.assign(base, {
			entry: path.join(srcPath, 'client.js'),
			output: {
				filename: 'client.bundle.js',
				path: destPath,
			},
		});
	} else {
		throw new Error('must specify target');
	}
};
