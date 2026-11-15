// Route tests run in Node with normal React (the service catalog imports icons).
// Only neutralize Next's bundler boundary marker; leave route dependencies real.
require.cache[require.resolve("server-only")] = { exports: {} };
