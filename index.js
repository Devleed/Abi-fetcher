#!/usr/bin/env node

const fs = require('fs');
const apiKeys = require('./apiKeys.json');

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const args = {
  network: 'rinkeby',
  chainId: 4,
};
process.argv.forEach((arg, index) => {
  if (index > 1) {
    arg = arg.split('=');
    args[arg[0]] = arg[1];
  }
});

(async () => {
  const response = await fetch(
    `https://api${
      args.network === 'mainnet' ? '' : `-${args.network}`
    }.etherscan.io/api?module=contract&action=getabi&address=${args.address.toLowerCase()}&apiKey=${
      apiKeys.etherscan
    }`,
  );
  const data = await response.json();

  fs.mkdirSync(args.output, { recursive: true });

  fs.writeFileSync(
    `${args.output}/${args.name || 'abi'}.json`,
    data.result,
    err => {
      console.error('error', err);
    },
  );
})();
