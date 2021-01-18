
# harmony-rosetta-cli
A nodejs cli for the harmony rosetta endpoints

## Installation

    git clone https://github.com/zyra-zia/harmony-rosetta-cli
    npm install
    npm link

## Usage

### Global Flags
The following flags are available with each command
**-e** 
Specifies the endpoint node to use for the command. e.g. -e https://rosetta.s2.t.hmny.io
**-j**
Displays the output as raw json output

### Commands
The following commands are available:
**networks**
e.g. harmony networks
This will list all available nodes in the harmony network. You can use the -e flag to specify a node to use. e.g. harmony network/status -e https://rosetta.s2.t.hmny.io

**network/list**
e.g. harmony network/list
Returns a list of Network Identifiers that this node supports

**network/status**
e.g. harmony network/status
Returns the status of the current network

**network/options**
e.g. harmony network/options
Returns the available operations and status codes for the current network

**account/balance \<address\> [block identifier]**
e.g. harmony account/balance one10re5ck2xpqq4vln95vt3l2lrgpwl4taykewxpk
Returns the balance of the specified account and the specified block

**block \<blockIndex\>**
e.g. harmony block 2241386
Returns details of the specified block

**block/transaction \<block hash\>  \<transaction hash\>**
e.g. harmony block/transaction 0x0376f64e703a25d41b4af91da402183f3b8cc9ab8b8c3f781377d99dd2c67555 0x398c63f6958547bf65f7055175fb9428a9c644de205c8fc19e8deadc41104201 -e https://rosetta.s0.b.hmny.io/block/transaction
Returns details of the specified block transaction

**mempool**
e.g. harmony mempool
Returns a list of transactions currently in the mempool

**mempool/transaction \<transaction hash\>**
e.g. harmony mempool/transaction 0x398c63f6958547bf65f7055175fb9428a9c644de205c8fc19e8deadc41104201
Returns details of the specified transaction

**getPublicAddress**
e.g. harmony getPublicAddress 03f91adb1671a2430484441b591bdad19358458e938ba291bf9e717031b6c3330d
Returns the public address associated with the specified public key