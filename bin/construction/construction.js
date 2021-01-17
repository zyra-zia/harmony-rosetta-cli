const axios = require("axios");

module.exports = {

    transferTokens: function (options) {
        

        /*let url = options.endpoint;
        url += "/network/options";

        const data = getNetworkData(options.endpoint);

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
            });*/
    }
    

}