var Options = require('./options');
var HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropRpc: {
      host: 'localhost',
      port: 8545,
      network_id: '3',
      gasPrice: 21000000000
    },
    rinkRpc: {
      host: 'localhost',
      port: 8545,
      network_id: '4',
      gasPrice: 21000000000
    },
    mainnetRpc: {
      host: 'localhost',
      port: 8000,
      network_id: '1',
      gas: 3000000
    },
    ganache: {
      host: 'localhost',
      port: 7545,
      network_id: '5777'
    },
    rinkInfura: {
      provider: () => {
        return new HDWalletProvider(Options.mnemonic, "https://rinkeby.infura.io/" + Options.token)
      },
      network_id: '4'
    }
  }
};
