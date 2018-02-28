/**
 * Created by zhaoyiyu on 2018/1/17.
 */

const Config = require('./../config/config.js');

Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(Config.transaction.url));

//init
const Tx = require('ethereumjs-tx');
const ethjsaccount = require('ethjs-account');
const fs = require('fs');
const solc = require('solc');

// compile the code
const input = fs.readFileSync('./contract/airdrop.sol');
const output = solc.compile(input.toString());
const abi = JSON.parse(output.contracts[':TokenAirDrop'].interface);

//------------------------------ init property ----------------------------

//airdrop contract address
const airContractAddress = Config.airdropModule.airContractAddress;
//user privateKey
const userPrivateKey = Config.airdropModule.userPrivateKey;
//erc20 token contract address
const tokenContractAddress = Config.airdropModule.tokenContractAddress;
//transfer from address
const transferFromAddress = Config.airdropModule.transferFromAddress;


//-------------------------------- contract --------------------------------

var token = new web3.eth.Contract(abi, airContractAddress);

token.events.TokenDrop(function (result) {
    //console.log("\n\n----------------------didWatchTokenDropEvent----------------------\n\n");
}).on('data', function(event){
    //console.log("\n\n----------------------didReceiveData----------------------\n\n");
    console.log(event.returnValues);
}).on('error',console.error);



var transfer = function(erc20TokenContractAddress , airDropOriginalAddress ,airdropDestinationAddresses, airdropAmounts, fromAddress,userPrivateKey,success, error) {

    //transaction config
    var t = {
        to: airContractAddress,
        value: '0x00',
        data: token.methods.airDrop(erc20TokenContractAddress,
            airDropOriginalAddress,
            airdropDestinationAddresses,
            airdropAmounts).encodeABI()
    };
    //get current gasPrice, you can use default gasPrice or custom gasPrice!
    web3.eth.getGasPrice().then(function(p) {
        //t.gasPrice = web3.utils.toHex(p);
        t.gasPrice = web3.utils.toHex(Config.transaction.gasPrice);
        //get nonce value
        web3.eth.getTransactionCount(fromAddress,
            function(err, r) {
                t.nonce = web3.utils.toHex(r);
                t.from = fromAddress;
                //get gasLimit value , you can use estimateGas or custom gasLimit!
                web3.eth.estimateGas(t,
                    function(err, gas) {
                        t.gasLimit = web3.utils.toHex(Config.transaction.gasLimit);
                        var tx = new Tx(t);
                        var privateKey = new Buffer(userPrivateKey, 'hex');

                        //sign
                        tx.sign(privateKey);
                        var serializedTx = '0x' + tx.serialize().toString('hex');
                        // console.log("serializedTx----"+serializedTx);

                        console.log("send signed transaction");

                        //sendSignedTransaction
                        web3.eth.sendSignedTransaction(serializedTx).on('transactionHash',function(hash){
                            console.log('hashId:'+ hash+'\n');
                        }).on('receipt',function(receipt){
                            //console.log('receipt:'+ JSON.stringify(receipt));
                            var s = receipt.status;
                            console.log("resultStatus:"+s);
                            if(s == 1){
                                success(JSON.stringify(receipt));
                            }
                            else {
                                error(JSON.stringify(receipt));
                            }
                        }).on('confirmation',function(confirmationNumber, receipt){

                            /*web3.eth.getBlockNumber(function (number) {
                                console.log("number--"+number+"\n");
                            });*/
                          //  console.log('entrance'+ JSON.stringify(confirmationNumber)+'--------------'+ JSON.stringify(receipt));
                        }).on('error',function(error){
                            console.log('Failure to send a signature transaction：'+error);
                        });
                    });
            });
        return this
    })
};


var privateKeyToAddress = function(privateKey,result) {
    var address = ethjsaccount.privateToAccount(privateKey).address;
    result(address);
};

var transferWithAddressAndAmounts = function(addresses,amounts) {

    var airdropAmounts = [];
    for (var i in amounts){

        var amount = amounts[i].toString();
        var obj = web3.utils.toWei(amount, 'ether');
        airdropAmounts.push(obj);
    }

//Get the private key corresponding account and initiate the transfer
    privateKeyToAddress(userPrivateKey,function (address) {

        transfer(tokenContractAddress,transferFromAddress,addresses,airdropAmounts,address,userPrivateKey,function (success) {

            console.log("success:"+success);
        },function (error) {

            console.log("error:"+error);
        });
    });
};

module.exports = {
    transferTool:transferWithAddressAndAmounts
};

//----------------------- get privateKey  ------------------
//var privateKey = web3.eth.accounts.decrypt({"address":"3b0ede4561606c26bc588b225bdafc35374a868e","crypto":{"cipher":"aes-128-ctr","ciphertext":"a4caa0654a4bc81523593117f6009aa6ef65bd6bfc427f0df2361171ec2470c9","cipherparams":{"iv":"d71d505800f4db2f9c24e52b20f0faa9"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"e12e9ee578a64e4c9d5f81a25d17b555da4035f10ff7c563e5e40bfa66198c9d"},"mac":"dc23ee572ff3fcc5e5fe7ef69c6c9f4c98b98eaa1bc5c85cbfed5738b34bf0fc"},"id":"c8917580-d6b8-490d-8a69-11d76f3e7021","version":3},'zhaoyiyu');
//console.log(privateKey);
/*
 {
 address: '0x585a40461FF12C6734E8549A7FB527120D4b8d0D',
 privateKey: '0x1311795de329cf9e8debd6441eae1437122e0bddf28911f8b6d770dc46a3b0e8',
 signTransaction: [Function: signTransaction],
 sign: [Function: sign],
 encrypt: [Function: encrypt]}
 { address: '0x3B0edE4561606C26bc588B225BdAfC35374A868e',
 privateKey: '0x5f36046052f3a23e7414c6039c458a8a9bd01362ab4ae80e6a4c0d360ae07e8d',
 signTransaction: [Function: signTransaction],
 sign: [Function: sign],
 encrypt: [Function: encrypt] }
 * */
