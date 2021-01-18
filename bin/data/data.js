const axios = require("axios");
const utils = require("../utils/utils.js");

module.exports = {

    listEndpoints: function (options) {
        console.log('Mainnet: ');
        console.log('  https://rosetta.s0.t.hmny.io');
        console.log('  https://rosetta.s1.t.hmny.io');
        console.log('  https://rosetta.s2.t.hmny.io');
        console.log('  https://rosetta.s3.t.hmny.io');
        console.log("");
        console.log('Testnet: ');
        console.log('  https://rosetta.s0.b.hmny.io');
        console.log('  https://rosetta.s1.b.hmny.io');
        console.log('  https://rosetta.s2.b.hmny.io');
        console.log('  https://rosetta.s3.b.hmny.io');
    }
    ,
    networkList: function (options) {
        let url = options.endpoint;
        url += "/network/list";
        axios.post(url, { headers: { Accept: "application/json" } })
            .then(res => {
                if (options.json) {
                    console.log(JSON.stringify(res.data, null, 4));
                }
                else {
                    const networks = res.data.network_identifiers[0];
                    let output = networks.blockchain + " " + networks.network + " " + networks.sub_network_identifier.network + " ";
                    if (networks.sub_network_identifier.metadata.is_beacon === true) {
                        output += "Is Beacon";
                    }
                    else {
                        output += "Not Beacon";
                    }
                    console.log(output);
                }
            });
    }

    ,
    networkOptions: function (options) {
        let url = options.endpoint;
        url += "/network/options";

        const data = utils.getNetworkData(options.endpoint);

        axios.post(url, data, { headers: { Accept: "application/json" } })
            .then(res => {
                if (options.json) {
                    console.log(JSON.stringify(res.data, null, 4));
                }
                else {
                    console.log("Rosetta Version: " + res.data.version.rosetta_version);
                    console.log("Node Version: " + res.data.version.node_version);
                    console.log("Allowed Operations:");
                    console.table(res.data.allow.operation_types);
                    console.log("Operation Statuses:");
                    console.table(res.data.allow.operation_statuses);
                    console.log("Errors:");
                    console.table(res.data.allow.errors);
                    console.log("Historical Balance Lookup: " + res.data.allow.historical_balance_lookup);
                }
            });
    }
    ,
    networkStatus: function (options) {
        let url = options.endpoint;
        url += "/network/status";

        const data = utils.getNetworkData(options.endpoint);

        axios.post(url, data, { headers: { Accept: "application/json" } })
            .then(res => {
                if (options.json) {
                    console.log(JSON.stringify(res.data, null, 4));
                }
                else {
                    console.log("Sync status: " + res.data.sync_status.stage);
                    console.log("Peers: " + res.data.peers.length);
                    console.log("");
                    console.log("Run 'network/status -j' command to get complete json output");
                }
            });
    }
    ,
    accountBalance: function (options) {

        let url = options.endpoint;
        url += "/account/balance";

        const data = utils.getNetworkData(options.endpoint);
        data.account_identifier = {
            "address": options.address
        }

        if (options.blockIdentifier !== undefined && isNaN(options.blockIdentifier)) {
            data.block_identifier = {
                "hash": options.blockIdentifier
            }
        }
        else if (options.blockIdentifier !== undefined) {
            data.block_identifier = {
                "index": options.blockIdentifier
            }
        }

        axios.post(url, data, { headers: { Accept: "application/json" } })
            .then(res => {
                if (options.json) {
                    console.log(JSON.stringify(res.data, null, 4));
                }
                else {
                    let mapped = res.data.balances.map((balance) => {
                        return { "Account Balance": balance.value + " " + balance.currency.symbol }
                    });
                    console.table(mapped);
                }
            });
    }
    ,
    getBlock: function (options) {

        let url = options.endpoint;
        url += "/block";

        const data = utils.getNetworkData(options.endpoint);

        if (isNaN(options.blockIdentifier)) {
            data.block_identifier = {
                "hash": options.blockIdentifier
            }
        }
        else {
            data.block_identifier = {
                "index": Number(options.blockIdentifier)
            }
        }
       
        axios.post(url, data, { headers: { Accept: "application/json" } })
            .then(res => {
                if (options.json) {
                    console.log(JSON.stringify(res.data, null, 4));
                }
                else {
                    const result = res.data;
                    console.log("Block Index: " + result.block.block_identifier.index);
                    console.log("Block Hash: " + result.block.block_identifier.hash);
                    console.log("Block Timestamp: ", result.block.timestamp);
                    console.log("---------------------------------------------");
                    console.log("Parent Block Index: " + result.block.parent_block_identifier.index);
                    console.log("Parent Block Hash: " + result.block.parent_block_identifier.hash);
                    console.log("---------------------------------------------");
                    let txs = result.block.transactions.map((tx) => {
                        return {"Transactions": tx.transaction_identifier.hash};
                    });
                    if(txs.length > 0){
                        console.table(txs);
                    }
                    
                }
            }).catch(function(error) {
                console.log(error);
            });
    }
    ,
    getBlockTransaction: function (options) {

        let url = options.endpoint;
        url += "/block/transaction";
        
        const data = utils.getNetworkData(options.endpoint);
        data.transaction_identifier = {
                "hash": options.txHash
            }
        data.block_identifier = {
                "hash": options.blockHash
            }
        
        axios.post(url, data, { headers: { Accept: "application/json" } })
            .then(res => {
                if (options.json) {
                    console.log(JSON.stringify(res.data, null, 4));
                }
                else {
                    const result = res.data;
                    console.log("Transaction Hash: " + result.transaction.transaction_identifier.hash);
                    console.log("Operations:");
                    let ops = result.transaction.operations.map((op) => {
                        return {
                                "Type": op.type,
                                "Status": op.status,
                                "Account": op.account.address,
                                "Amount": op.amount.value
                            };
                    });
                    if(ops.length > 0){
                        console.table(ops);
                    }
                    
                }
            }).catch(function(error) {
                console.log(error.response.data);
            });
    }
    ,

    getMempoolTxs: function (options) {

        let url = options.endpoint;
        url += "/mempool";

        const data = utils.getNetworkData(options.endpoint);
       
        axios.post(url, data, { headers: { Accept: "application/json" } })
            .then(res => {
                if (options.json) {
                    console.log(JSON.stringify(res.data, null, 4));
                }
                else {
                    let txs = res.data.transaction_identifiers;
                    console.log("Transactions: " + txs.length);
                    if(txs.length > 0){
                        console.table(txs);
                    }
                    
                }
            }).catch(function(error) {
                console.log(error);
            });
    }
    ,
    getMempoolTransaction: function (options) {

        let url = options.endpoint;
        url += "/mempool/transaction";
        
        const data = utils.getNetworkData(options.endpoint);
        data.transaction_identifier = {
                "hash": options.txIdentifier
            }

        axios.post(url, data, { headers: { Accept: "application/json" } })
            .then(res => {
                if (options.json) {
                    console.log(JSON.stringify(res.data, null, 4));
                }
                else {
                    const result = res.data;
                    console.log("Transaction Hash: " + result.transaction.transaction_identifier.hash);
                    console.log("Operations:");
                    let ops = result.transaction.operations.map((op) => {
                        return {
                                "Type": op.type,
                                "Status": op.status,
                                "Account": op.account.address,
                                "Amount": op.amount.value
                            };
                    });
                    if(ops.length > 0){
                        console.table(ops);
                    }
                    
                }
            }).catch(function(error) {
                console.log(error.response.data);
            });
    }

}