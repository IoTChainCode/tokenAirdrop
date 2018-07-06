/**
 * Created by zhaoyiyu on 2018/1/30.
 */

const Tx = require('ethereumjs-tx');
const ethjsaccount = require('ethjs-account');

const Config = require('../../config/config');
Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(Config.transaction.url));
//------------------------------ init property ----------------------------

const userPrivateKey = Config.userModule.userPrivateKey;

//------------------------------ api ----------------------------
function blockTransaction(t,hashIdCall,success,error){

    let  fromAddress = privateKeyToAddress(userPrivateKey);

    console.log('fromAddress',fromAddress);

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
                        let tx = new Tx(t);
                        let privateKey = new Buffer(userPrivateKey, 'hex');

                        //sign
                        tx.sign(privateKey);
                        let serializedTx = '0x' + tx.serialize().toString('hex');
                        //console.log("serializedTx----"+serializedTx);

                        console.log("send signed transaction");

                        //sendSignedTransaction
                        web3.eth.sendSignedTransaction(serializedTx)
                            .on('transactionHash',function(hash){

                                console.log('hashId:'+ hash+'\n');
                                hashIdCall(hash);

                            }).on('receipt',function(receipt){
                            //console.log('receipt:'+ JSON.stringify(receipt));

                            let s = receipt.status;
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


function privateKeyToAddress(privateKey) {

    let address = ethjsaccount.privateToAccount(privateKey).address;
    return address;
}

function startBlockTransaction(t,getHashIdCall,successCall,errorCall) {

    console.log('startBlockTransaction');

    blockTransaction(t,function (hashId) {

        if (getHashIdCall != null){

            getHashIdCall(hashId);
        }

    },function (success) {

        console.log("Transaction Success:\n"+JSON.stringify(success));
        if (successCall != null){

            successCall(success);
        }

    },function (error) {

        console.log("Failure to send a signature transaction:\n"+error);

        if (errorCall != null){

            errorCall(error);
        }
    });
}

module.exports = {

    startTransaction:startBlockTransaction
};