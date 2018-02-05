/**
 * Created by zhaoyiyu on 2018/1/17.
 */

const Config = require('./config/config.js');

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

//amount of airdrop
const ercAirDropAmount = web3.utils.toWei(Config.airdropModule.ercAirDropAmount, 'ether');
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

//---------------- read update.txt content  ------------

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


//Get the private key corresponding account and initiate the transfer
privateKeyToAddress(userPrivateKey,function (address) {

        console.log("\naddress:"+address);

        transfer(tokenContractAddress,transferFromAddress,addresses,amounts,address,userPrivateKey,function (success) {

            console.log("success:"+success);
        },function (error) {

            console.log("error:"+error);
        });
    });
});