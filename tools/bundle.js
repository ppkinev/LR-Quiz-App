/**
 * React Static Boilerplate
 * https://github.com/koistya/react-static-boilerplate
 * Copyright (c) Konstantin Tarkus (@koistya) | MIT license
 */

import webpack from 'webpack';
import path from 'path';
import merge from 'lodash.merge';
import task from './lib/task';
import config from './webpack.config';

export default task(function bundle(dir = 'build') {

	// overwrite path config
	const configWithDir = merge({}, config, {
		output: {
			path: path.join(__dirname, `../${dir}`)
		}
	});

	return new Promise((resolve, reject) => {
		const bundler = webpack(configWithDir);
		const run = (err, stats) => {
			if (err) {
				reject(err);
			} else {
				console.log('Bundler stats: ', stats.toString(configWithDir.stats));
				resolve();
			}
		};
		bundler.run(run);
	});
});
