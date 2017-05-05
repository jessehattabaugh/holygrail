import path from "path";
const nodeExternals = require("webpack-node-externals");

const base = {
	devtool: "source-map",
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: "babel-loader",
			},
		],
	},
};

const srcPath = path.join(__dirname, "src");
const destPath = path.join(__dirname, "dest");

module.exports = env => {
	if (env.target == "server") {
		return Object.assign(base, {
			entry: path.join(srcPath, "server.js"),
			output: {
				filename: "",
				path: destPath,
			},
			target: "node",
			externals: [nodeExternals()],
		});
	}
};
