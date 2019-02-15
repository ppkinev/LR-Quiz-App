/**
 * React Static Boilerplate
 * https://github.com/koistya/react-static-boilerplate
 * Copyright (c) Konstantin Tarkus (@koistya) | MIT license
 */

import task from './lib/task';

export default task(async function build(dir = 'build') {
	await require('./clean')(dir);
	await require('./copy')(dir);
	await require('./bundle')(dir);
	// await require('./render')(dir);
});
