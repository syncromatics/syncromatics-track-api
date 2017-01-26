var context = require.context('.', true, /\.test\.js$/); // eslint-disable-line no-var
context.keys().forEach(context);
