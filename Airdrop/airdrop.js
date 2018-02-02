/**
 * Created by zhaoyiyu on 2018/1/17.
 */

Web3 = require('web3');
//url = 'https://rinkeby.infura.io/0x585a40461ff12c6734e8549a7fb527120d4b8d0d';
url = "https://mainnet.infura.io";
web3 = new Web3(new Web3.providers.HttpProvider(url));
 //var net = require('net');
 //var web3 = new Web3(new Web3.providers.IpcProvider('/Users/apple/Library/Ethereum/rinkeby/geth.ipc', net));

//init
const Tx = require('ethereumjs-tx');
const ethjsaccount = require('ethjs-account');
const fs = require('fs');
const solc = require('solc');

// compile the code
const input = fs.readFileSync('./contract/airdrop.sol');
const output = solc.compile(input.toString());
const abi = JSON.parse(output.contracts[':TokenAirDrop'].interface);


//------------------------------ 参数初始化 ----------------------------
//空投数量
const ercAirDropAmount = web3.utils.toWei('1', 'ether');
//空投合约地址
const airContractAddress = '';
//用户私钥
const userPrivateKey = '';
//erc20代币合约地址
const tokenContractAddress = '';
//代币转出地址
const transferFromAddress = '';
//-------------------------------- end --------------------------------

var token = new web3.eth.Contract(abi, airContractAddress);


token.events.TokenDrop(function (result) {
    //console.log("\n\n----------------------didWatchTokenDropEvent----------------------\n\n");
}).on('data', function(event){
    //console.log("\n\n----------------------didReceiveData----------------------\n\n");
    console.log(event.returnValues);
}).on('error',console.error);



//从地址from转移value个token到地址to。success和error是回调函数
var transfer = function(erc20TokenContractAddress , airDropOriginalAddress ,airdropDestinationAddresses, airdropAmounts, fromAddress,userPrivateKey,success, error) {

    console.log("空投发送地址：\n"+airDropOriginalAddress+"\n空投目标地址:\n"+airdropDestinationAddresses +"\n空投合约地址：\n",erc20TokenContractAddress+"\n\n");

    //定义transaction
    var t = {
        to: airContractAddress,
        value: '0x00',
        data: token.methods.airDrop(erc20TokenContractAddress,
            airDropOriginalAddress,
            airdropDestinationAddresses,
            airdropAmounts).encodeABI()
    };
    //获取当前gas价格
    web3.eth.getGasPrice().then(function(p) {
        //t.gasPrice = web3.utils.toHex(p);
        t.gasPrice = web3.utils.toHex(2000000000);
        //获取nonce
        web3.eth.getTransactionCount(fromAddress,
            function(err, r) {
                t.nonce = web3.utils.toHex(r);
                t.from = fromAddress;
                //获取gasLimit
                web3.eth.estimateGas(t,
                    function(err, gas) {
                        gasLimit = '4700000';
                        t.gasLimit = web3.utils.toHex(gasLimit);

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
                            console.log('发送签名交易失败，'+error);
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

//----------------  逐行读取 update.txt 内容  ------------

var addresses = [];
var amounts = [];

var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('airdropList.txt')
});

lineReader.on('line', function (line) {
    var re = /0x([a-f]|[A-F]|[0-9])*/;
    var address = line.match(re)[0];
    addresses.push( address );
});

lineReader.on('close', function () {

    console.log(" ---- read address end");
    console.log(addresses);

    for (var i = 0; i < addresses.length; i++) {
        amounts.push(ercAirDropAmount);
    }


//获取私钥对应账号并发起转帐
    privateKeyToAddress(userPrivateKey,function (address) {

        console.log("\naddress:"+address);

        transfer(tokenContractAddress,transferFromAddress,addresses,amounts,address,userPrivateKey,function (success) {

            console.log("success:"+success);
        },function (error) {

            console.log("error:"+error);
        });
    });
});