module.exports = {

findNetwork: function(endpoint) {
    if (endpoint.indexOf("t.hmny") > 0) {
        return "Mainnet";
    }
    else {
        return "Testnet";
    }
}
,
findShard: function(endpoint) {
    if (endpoint.indexOf("s0") > 0) {
        return "0";
    }
    else if (endpoint.indexOf("s1") > 0) {
        return "1";
    }
    else if (endpoint.indexOf("s2") > 0) {
        return "2";
    }
    else {
        return "3";
    }
}
,
getNetworkData: function(endpoint) {
    let network = this.findNetwork(endpoint);
    let shard = this.findShard(endpoint);
    const isBeacon = (shard === "0");

    const data = {
        "network_identifier": {
            "blockchain": "Harmony",
            "network": network,
            "sub_network_identifier": {
                "network": "shard " + shard,
                "metadata": {
                    "is_beacon": isBeacon
                }
            }
        },
        "metadata": {}
    }
    return data;
}

}