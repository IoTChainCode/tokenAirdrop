/**
 * Created by zhaoyiyu on 2018/1/30.
 */
const fs = require('fs');
const solc = require('solc');

var Tx = require('ethereumjs-tx');
var ethjsaccount = require('ethjs-account');

const Config = require('./../config/config.js');
Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(Config.transaction.url));

//------------------------------ init property ----------------------------

//user privateKey
const userPrivateKey = Config.deployModule.userPrivateKey;
//contract address
const contractPath = './contract/airdrop.sol';

//-------------------------------- contract --------------------------------
// compile the code
const input = fs.readFileSync(contractPath);
const output = solc.compile(input.toString());
const bytecode = output.contracts[':TokenAirDrop'].bytecode;

// deploy function
function deployContract(userPrivateKey,fromAddress,success, error) {

//  transaction config
    var t = {
        value: '0x00',
        data: ('0x'+bytecode)
    };
    //get current gasPrice, you can use default gasPrice or custom gasPrice!
    web3.eth.getGasPrice().then(function(p) {
        //t.gasPrice = web3.utils.toHex(p);
        //1 Gwei
        t.gasPrice = web3.utils.toHex(Config.transaction.gasPrice);
        //get nonce
        web3.eth.getTransactionCount(fromAddress,
            function(err, r) {
                t.nonce = web3.utils.toHex(r);
                t.from = fromAddress;

                //get gasLimit value , you can use estimateGas or custom gasLimit!
                web3.eth.estimateGas(t,
                    function(err, gas) {
                        //web3.utils.toHex(gas);
                        t.gasLimit = web3.utils.toHex(Config.transaction.gasLimit);

                        //初始化transaction
                        var tx = new Tx(t);
                        var privateKey = new Buffer(userPrivateKey, 'hex');

                        //sign
                        tx.sign(privateKey);
                        var serializedTx = '0x' + tx.serialize().toString('hex');
                        //console.log("serializedTx----"+serializedTx);

                        console.log("send signed transaction");

                        //sendSignedTransaction
                        web3.eth.sendSignedTransaction(serializedTx)
                          .on('transactionHash',function(hash){
                            console.log('hashId:'+ hash+'\n');
                        }).on('receipt',function(receipt){
                            //console.log('receipt:'+ JSON.stringify(receipt));
                            var s = receipt.status;
                            console.log("resultStatus:"+s);
                            if(s == 1){
                                success(receipt);
                            }
                            else {
                                error(receipt);
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
    });
};


var privateKeyToAddress = function(privateKey,result) {
    var address = ethjsaccount.privateToAccount(privateKey).address;
    result(address);
};

privateKeyToAddress(userPrivateKey,function (address) {

    console.log('from：'+address);

    deployContract(userPrivateKey,address,function (success) {

        console.log('\ndeploySuccess!!!  \nblockHash：'+ success.transactionHash +' \ncontractAddress：'+success.contractAddress);
        //console.log("success:"+ JSON.stringify(success));
    },function (error) {

        console.log("error:"+JSON.stringify(error));
    });
});

/*
 deploySuccess!!!
 blockHash：0x598ecb89d6d999d56fb0f5d4078d1b6b424aadabb09a7a0037b32911374bad68
 contractAddress：0xceCf9E39E17330fF5e802895aaa5Bd02614313Bd
* */