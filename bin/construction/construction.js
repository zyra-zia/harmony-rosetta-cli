const axios = require("axios");
const utils = require("../utils/utils.js");
const {
    sign,
    encode,
    decode,
    randomBytes,
    toBech32,
    fromBech32,
    HarmonyAddress,
    generatePrivateKey,
    getPubkeyFromPrivateKey,
    getAddressFromPublicKey,
    getAddressFromPrivateKey,
    encryptPhrase,
    decryptPhrase
  } = require('@harmony-js/crypto');
  const { strip0x } = require('@harmony-js/utils');

function derive(options) {
    let pub;
    if(options.privateKey !== undefined)
        pub = getPubkeyFromPrivateKey(options.privateKey);
    else
        pub = options.publicKey;

    //remove leading 0x from public key
    if(pub.startsWith("0x")){
        pub = pub.replace("0x","");
    }

    let url = options.endpoint;
    url += "/construction/derive";

    const data = utils.getNetworkData(options.endpoint);
    data.public_key = {
        "hex_bytes" : pub,
        "curve_type": "secp256k1"
    };

    return axios.post(url, data, { headers: { Accept: "application/json" } });
}

function preprocess(options, data) {
    let url = options.endpoint;
    url += "/construction/preprocess";

    return axios.post(url, data, { headers: { Accept: "application/json" } });
}

function metadata(options, data) {
    let url = options.endpoint;
    url += "/construction/metadata";

    return axios.post(url, data, { headers: { Accept: "application/json" } });
}

function payloads(options, data) {
    let url = options.endpoint;
    url += "/construction/payloads";

    return axios.post(url, data, { headers: { Accept: "application/json" } });
}


function combine(options, data) {
    let url = options.endpoint;
    url += "/construction/combine";

    return axios.post(url, data, { headers: { Accept: "application/json" } });
}

function parse(options, data) {
    let url = options.endpoint;
    url += "/construction/parse";

    return axios.post(url, data, { headers: { Accept: "application/json" } });
}

function hash(options, data) {
    let url = options.endpoint;
    url += "/construction/hash";

    return axios.post(url, data, { headers: { Accept: "application/json" } });
}

function submit(options, data) {
    let url = options.endpoint;
    url += "/construction/submit";

    return axios.post(url, data, { headers: { Accept: "application/json" } });
}

module.exports = {

    getPublicAddress: async function(options){
        derive(options).then((res)=>{
            console.log(res.data);
        })
        .catch((error)=>{
            console.log(error);
        });
    }
    ,
    transferTokens: async function (options) {
        
        let data = utils.getNetworkData(options.endpoint);

        const hexAddr = getAddressFromPrivateKey(options.privateKey);
        const hmyAddr = toBech32(hexAddr);

        let pub = getPubkeyFromPrivateKey(options.privateKey);
        if(pub.startsWith("0x")){
            pub = pub.replace("0x","");
        }

        let operations =  [
            {
                "operation_identifier": {
                    "index": 0
                },
                "type": "NativeTransfer",
                "status": "",
                "account": {
                    "address": hmyAddr,
                    "metadata": {
                        "hex_address": hexAddr
                    }
                },
                "amount": {
                    "value": "-" + options.amount,
                    "currency": {
                        "symbol": "ONE",
                        "decimals": 18
                    }
                }
            },
            {
                "operation_identifier": {
                    "index": 1
                },
                "related_operations": [
                    {
                        "index": 0
                    }
                ],
                "type": "NativeTransfer",
                "status": "",
                "account": {
                    "address": options.recipient
                },
                "amount": {
                    "value": options.amount,
                    "currency": {
                        "symbol": "ONE",
                        "decimals": 18
                    }
                }
            }
        ];

        let payload;

        let preprocess_data = {
            "network_identifier": data.network_identifier,
            "operations": operations,
            "suggested_fee_multiplier": 2,
            "metadata": {
                "from_shard": Number(utils.findShard(options.endpoint)),
                "to_shard": Number(utils.findShard(options.endpoint)),
            }
        }

        preprocess(options, preprocess_data)
        .then((res)=>{
            
            res.data.network_identifier = data.network_identifier;

            res.data.public_keys = [
                {
                    "hex_bytes": pub,
                    "curve_type": "secp256k1"
                }
            ]

            return metadata(options, res.data);
        })
        .then((res)=>{
            let metadata = res.data.metadata;
            let payloadData = {
                "network_identifier": data.network_identifier,
                "operations": operations,
                "metadata": metadata,
                "public_keys" :  [{
                    "hex_bytes": pub,
                    "curve_type": "secp256k1"
                }]
            };
            //console.log(JSON.stringify(payloadData, null, 4));

            return payloads(options, payloadData);
        })
        .then((res)=>{
            payload = res.data;
            //console.log(payload);
            let parseData = {
                "network_identifier": data.network_identifier,
                "transaction": res.data.unsigned_transaction,
                "signed" : false
            };
            return parse(options, parseData);
        })
        .then((res)=>{
            let buffer = Buffer.from(payload.payloads);
            let rsv = sign(buffer, options.privateKey);
            let hex_bytes = strip0x(rsv.r) + strip0x(rsv.s) + (rsv.v).toString();

            let combineData = {
                "network_identifier": data.network_identifier,
                "unsigned_transaction": payload.unsigned_transaction,
                "signatures": [
                    {
                        "hex_bytes": hex_bytes,
                        "signing_payload": payload.payloads[0],
                        "public_key": {
                            "hex_bytes": pub,
                            "curve_type": "secp256k1"
                        },
                        "signature_type": "ecdsa_recovery"
                    }
                ]
            };

            //console.log(JSON.stringify(combineData,null, 4));
            
            return combine(options, combineData);

        })
        .then((res)=>{
            
            console.log(res.data);
            
            //return parse(options, parseData);
        })
        .catch((error)=>{
            console.log(error);
        });

    }
    

}