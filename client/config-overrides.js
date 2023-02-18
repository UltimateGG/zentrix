const { useBabelRc, override, addWebpackAlias } = require('customize-cra');


module.exports = override(
  useBabelRc(),
  addWebpackAlias({
    'react': 'preact/compat',
    'react-dom': 'preact/compat',
    'react/jsx-runtime': 'preact/jsx-runtime',
  }),
);
