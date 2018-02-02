/**
 * Created by zhaoyiyu on 2018/1/29.
 */

Web3 = require('web3');
//url = 'https://rinkeby.infura.io/0x585a40461ff12c6734e8549a7fb527120d4b8d0d';
url = "https://mainnet.infura.io";
const web3 = new Web3(new Web3.providers.HttpProvider(url));

//init
const Tx = require('ethereumjs-tx');
const ethjsaccount = require('ethjs-account');
const fs = require('fs');
const solc = require('solc');

// compile the code
const input = fs.readFileSync('./contract/erc20Token.sol');
const output = solc.compile(input.toString());
const abi = JSON.parse(output.contracts[':TokenERC20'].interface);

//------------------------------ 参数初始化 ----------------------------
//授权数量
var amount = web3.utils.toWei('1000', 'ether');
//空投合约地址
var airdropApproveAddress = '';
//用户私钥
var userPrivateKey = '';
//erc20代币合约地址
var tokenContractAddress = '';
//-------------------------------- end --------------------------------


// init contract with erc20Token address
var token = new web3.eth.Contract(abi, tokenContractAddress);

function approveTransfer(approveAddress,amount,fromAddress,userPrivateKey,success, error) {

//定义transaction
    var t = {
        to: tokenContractAddress,
        value: '0x00',
        data: token.methods.approve(approveAddress,
            amount).encodeABI()
    };
//获取当前gas价格（暂未用）
    web3.eth.getGasPrice().then(function(p) {
        //t.gasPrice = web3.utils.toHex(p);
        t.gasPrice = web3.utils.toHex(2000000000);
        //获取nonce
        web3.eth.getTransactionCount(fromAddress,
            function(err, r) {
                t.nonce = web3.utils.toHex(r);
                t.from = fromAddress;
                //获取gasLimit（暂未用）
                web3.eth.estimateGas(t,
                    function(err, gas) {
                        gas = '4700000';
                        t.gasLimit = web3.utils.toHex(gas);

                        //初始化transaction
                        var tx = new Tx(t);
                        var privateKey = new Buffer(userPrivateKey, 'hex');

                        //签名
                        tx.sign(privateKey);
                        var serializedTx = '0x' + tx.serialize().toString('hex');
                        // console.log("serializedTx----"+serializedTx);

                        console.log("发送已签名交易");

                        //发送原始transaction
                        web3.eth.sendSignedTransaction(serializedTx).on('transactionHash',function(hash){
                            console.log('交易hash块:'+ hash+'\n');
                        }).on('receipt',function(receipt){
                            //console.log('receipt入口:'+ JSON.stringify(receipt));
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

//获取私钥对应的地址，并发起授权
privateKeyToAddress(userPrivateKey,function (address) {

    console.log('from地址：'+address);

    approveTransfer(airdropApproveAddress,amount,address,userPrivateKey,function (success) {

        console.log("success:"+success);
    },function (error) {

        console.log("error:"+error);
    });
});







