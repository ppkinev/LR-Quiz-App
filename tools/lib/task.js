/**
 * React Static Boilerplate
 * https://github.com/koistya/react-static-boilerplate
 * Copyright (c) Konstantin Tarkus (@koistya) | MIT license
 */

function format(time) {
  return time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
}

export default (fn) => async (...args) => {
  const start = new Date();
  console.log(`[${format(start)}] Starting '${fn.name} %s'...`, JSON.stringify(args));
  await fn.apply(null, args);
  const end = new Date();
  const time = end.getTime() - start.getTime();
  console.log(`[${format(end)}] Finished '${fn.name}' after ${time}ms`);
};
