/**
 * Created by zhaoyiyu on 2018/1/30.
 */
const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
const url = "https://mainnet.infura.io";
//const url = 'https://rinkeby.infura.io/0x585a40461ff12c6734e8549a7fb527120d4b8d0d';
const web3 = new Web3(new Web3.providers.HttpProvider(url));
var Tx = require('ethereumjs-tx');
var ethjsaccount = require('ethjs-account');


//------------------------------ 参数初始化 ----------------------------
//用户私钥
const userPrivateKey = '';
//合约路径
const contractPath = './contract/airdrop.sol';
//-------------------------------- end --------------------------------


// compile the code
const input = fs.readFileSync(contractPath);
const output = solc.compile(input.toString());
const bytecode = output.contracts[':TokenAirDrop'].bytecode;

// deploy function
function deployContract(userPrivateKey,fromAddress,success, error) {

    //定义transaction
    var t = {
        value: '0x00',
        data: ('0x'+bytecode)
    };
    //获取当前gas价格（暂未用）
    web3.eth.getGasPrice().then(function(p) {
        //t.gasPrice = web3.utils.toHex(p);
        //1 Gwei
        t.gasPrice = web3.utils.toHex(2000000000);
        //获取nonce
        web3.eth.getTransactionCount(fromAddress,
            function(err, r) {
                t.nonce = web3.utils.toHex(r);
                t.from = fromAddress;

                //获取gasLimit(暂未用)
                web3.eth.estimateGas(t,
                    function(err, gas) {
                        //web3.utils.toHex(gas);

                        gasLimt = '4700000';
                        t.gasLimit = web3.utils.toHex(gasLimt);

                        //初始化transaction
                        var tx = new Tx(t);
                        var privateKey = new Buffer(userPrivateKey, 'hex');

                        //签名
                        tx.sign(privateKey);
                        var serializedTx = '0x' + tx.serialize().toString('hex');
                        //console.log("serializedTx----"+serializedTx);

                        console.log("发送已签名交易");

                        //发送原始transaction
                        web3.eth.sendSignedTransaction(serializedTx)
                          .on('transactionHash',function(hash){
                            console.log('交易hash块:'+ hash+'\n');
                        }).on('receipt',function(receipt){
                            //console.log('receipt入口:'+ JSON.stringify(receipt));
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
                            //  console.log('验证入口'+ JSON.stringify(confirmationNumber)+'--------------'+ JSON.stringify(receipt));
                        }).on('error',function(error){
                            console.log('发送签名交易失败，error'+error);
                        });
                    });
            });
    });
};


var privateKeyToAddress = function(privateKey,result) {
    var address = ethjsaccount.privateToAccount(privateKey).address;
    result(address);
};

//获取私钥对应账号
privateKeyToAddress(userPrivateKey,function (address) {

    console.log('from地址：'+address);

    //查看余额
    //web3.eth.getBalance(address).then(console.log);
    //web3.eth.getBlockNumber().then(console.log);

    deployContract(userPrivateKey,address,function (success) {

        console.log('\ndeploySuccess!!!  \nblockHash：'+ success.transactionHash +' \ncontractAddress：'+success.contractAddress);
        //console.log("success:"+ JSON.stringify(success));
    },function (error) {

        console.log("error:"+JSON.stringify(error));
    });
});
