#!/usr/bin/env node

const data = require("./data/data.js");
const construction = require("./construction/construction.js");

const yargs = require("yargs");
const { option, require: req } = require("yargs");

const options = yargs
  .scriptName("harmony")
  .usage("Usage: $0 <cmd> [args]")
  .command('networks', 'Lists all available endpoint nodes', (yargs) => {
  }, data.listEndpoints)
  .command('network/list', 'Returns a list of NetworkIdentifiers that this Rosetta server supports.', (yargs) => { }, data.networkList)
  .command('network/options', 'Returns the version information and allowed network-specific types for a NetworkIdentifier', (yargs) => { }, data.networkOptions)
  .command('network/status', 'Returns the current status of the network requested', (yargs) => { }, data.networkStatus)
  .command('account/balance <address> [blockIdentifier]', 'Get an account\'s balance',
    (yargs) => {
      yargs.positional('address', {
        describe: 'Account address to find the balance of',
        type: 'string'
      }).positional('blockIdentifier', {
        describe: 'optional block index or hash to get historical balance of account'
      })
    },
    data.accountBalance)
  .command('block <blockIdentifier>', 'Get block details',
    (yargs) => {
      yargs.positional('blockIdentifier', {
        describe: 'Block index or hash',
        type: 'string'
      })
    },
    data.getBlock)
    .command('block/transaction <blockHash> <txHash>', 'Get transaction details',
    (yargs) => {
      yargs.positional('blockHash', {
        describe: 'Block hash',
        type: 'string'
      })
      .positional('txHash', {
        describe: 'Transaction hash',
        type: 'string'
      })
    },
    data.getBlockTransaction)
    .command('mempool', 'Returns all Transaction Identifiers in the mempool.', (yargs) => { }, data.getMempoolTxs)
    .command('mempool/transaction <txIdentifier>', 'Gets a transaction in the mempool by its Transaction Identifier',
    (yargs) => {
      yargs.positional('txIdentifier', {
        describe: 'Transaction hash',
        type: 'string'
      })
    },
    data.getMempoolTransaction)
    .command('getPublicAddress <publicKey>', 'Gets the account identifier associated with this public key',
    (yargs) => {
      yargs.positional('publicKey', {
        describe: 'Public Key',
        type: 'string'
      })
    },
    construction.getPublicAddress)
  .option("e", { alias: "endpoint", describe: "Endpoint node e.g. https://rosetta.s0.t.hmny.io ", type: "string", default: "https://rosetta.s0.t.hmny.io" })
  .option("j", { alias: "json", describe: "Outputs complete JSON response from server", type: "boolean" })
  .showHelpOnFail(true)
  .demandCommand(1, "")
  .argv;

