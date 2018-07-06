
const Config = require('../../config/config.js');

Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(Config.transaction.url));

//contract address
const contractPath = './../../contract/converter.sol';

//-------------------------------- contract --------------------------------

const fs = require('fs');
const solc = require('solc');
const input = fs.readFileSync(contractPath);
const output = solc.compile(input.toString());
const abi = JSON.parse(output.contracts[':BancorConverter'].interface);

var token = new web3.eth.Contract(abi, '0x5e04821d5Af7616f37Bf13bcD920571635d4989B');

token.methods.extensions().call(null,function(error,result){
    console.log("extensions -> "+result);
});
token.methods.manager().call(null,function(error,result){
    console.log("manager -> "+result);
});
token.methods.maxConversionFee().call(null,function(error,result){
    console.log("maxConversionFee -> "+result);
});
token.methods.conversionFee().call(null,function(error,result){
    console.log("conversionFee -> "+result);
});
token.methods.getQuickBuyPathLength().call(null,function(error,result){
    console.log("getQuickBuyPathLength -> "+result);
});