const { useBabelRc, override, addWebpackModuleRule, addWebpackAlias } = require('customize-cra');


module.exports = override(
  useBabelRc(),
  /*addWebpackModuleRule({
    
  }),*/
  addWebpackAlias({
    'react': 'preact/compat',
    'react-dom': 'preact/compat',
    'react/jsx-runtime': 'preact/jsx-runtime',
  }),
);
