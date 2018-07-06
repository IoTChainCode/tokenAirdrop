/**
 * Created by zhaoyiyu on 2018/1/29.
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
const input = fs.readFileSync('./../contract/erc20Token.sol');
const output = solc.compile(input.toString());
const abi = JSON.parse(output.contracts[':TokenERC20'].interface);

//------------------------------ init property ----------------------------

//amount of airdrop
let amount = web3.utils.toWei(Config.approveModule.amount, 'ether');
//airdrop contract address
let airdropApproveAddress = Config.approveModule.approveAddress;
//erc20 token contract address
let tokenContractAddress = Config.approveModule.tokenContractAddress;

//-------------------------------- contract --------------------------------
let token = new web3.eth.Contract(abi, tokenContractAddress);

let execute = require('./base/execute');

function approveTransfer(approveAddress,amount,hashIdCall,successCall, errorCall) {

    let  functionABI = token.methods.approve(approveAddress,amount).encodeABI();

    execute.executeFunction(tokenContractAddress,functionABI,hashIdCall,successCall,errorCall);
}

approveTransfer(airdropApproveAddress,amount,function (hashId) {

    console.log('approve HashId',hashId);
},function (success) {

    console.log('execute approveTransfer success');
},function (error) {

    console.log('execute approveTransfer error');
});







