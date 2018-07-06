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


const tokenInput = fs.readFileSync('./contract/erc20Token.sol');
const tokenOutput = solc.compile(tokenInput.toString());
const tokenAbi = JSON.parse(tokenOutput.contracts[':TokenERC20'].interface);


function privateKeyToAddress(privateKey) {

    return ethjsaccount.privateToAccount(privateKey).address;
}

//------------------------------ init property ----------------------------

//airdrop contract address
const airContractAddress = Config.airdropModule.airdropContractAddress;
//user privateKey
const userPrivateKey = Config.userModule.userPrivateKey;
//erc20 token contract address
const tokenContractAddress = Config.airdropModule.tokenContractAddress;
//transfer from address
const fromAddress = privateKeyToAddress(userPrivateKey);
//network type
const networkType = Config.internetType;

//-------------------------------- function --------------------------------

const execute = require('./base/execute');

function transfer(erc20TokenContractAddress , airDropOriginalAddress ,airdropDestinationAddresses, airdropAmounts,hashIdCallBack,successCall, errorCall) {

    let airdropContract = new web3.eth.Contract(abi, airContractAddress);

    let dataAbi = airdropContract.methods.airDrop(erc20TokenContractAddress,
        airDropOriginalAddress,
        airdropDestinationAddresses,
        airdropAmounts).encodeABI();

    execute.executeFunction(airContractAddress,dataAbi,hashIdCallBack,successCall,errorCall);
}


let totalAirdropAdress = [];
let totalAmounts = [];
let airdropResultCall;

let listen = require('./base/listen');

//总共需要空投的数量
let totalAmountOfAirdropList = 0;
//每次空投数量
const onceAmountOfAirdropList = 100;

//标志位
let didSendLastAirdropList;
//是否需要将剩下的全部发出
let needSendLastList = false;

//上一波交易是否完成
let perTranscationDidComplete = true;

function transferWithAddressAndAmounts(addresses,amounts,resultCall) {

    for (let i in amounts){

        let amount = amounts[i].toString();
        let obj = web3.utils.toWei(amount, 'ether');
        totalAmounts.push(obj);
    }

    totalAirdropAdress = addresses;

    airdropResultCall = resultCall;

    //初始化数据
    totalAmountOfAirdropList = addresses.length;
    needSendLastList = false;


    //每5秒查询一次上一波是否发生成功
    let interval = setInterval(function(){

        if (perTranscationDidComplete){

            clearInterval(interval);
            startHandleAirdrop(0);
        }
    },5*1000);
}


function startHandleAirdrop(index) {

    console.log('\n');

    let currentAddresses = [];
    let currentAmounts = [];

    didSendLastAirdropList = false;
    perTranscationDidComplete = false;

    let i = index * onceAmountOfAirdropList;

    let topIndex = (index +1) * onceAmountOfAirdropList;

    if (needSendLastList){
        topIndex = totalAmountOfAirdropList;
    }

    for(i; i < topIndex ; i ++ ){

        let address = totalAirdropAdress[i];
        let amount = totalAmounts[i];

        currentAddresses.push(address);
        currentAmounts.push(amount);

        //判断是否为最后一部分
        if (i == totalAirdropAdress.length - 1){
            didSendLastAirdropList = true;
            break;
        }
    }

    console.log(currentAddresses +'\n'+currentAmounts);

    transfer(tokenContractAddress,fromAddress,currentAddresses,currentAmounts,function (hashId) {

        let parameter = {'hashId':hashId,'tokenAbi':tokenAbi,'tokenAddress':tokenContractAddress,'fromAddress':fromAddress};

        listen.startListenAirdropResult(parameter,function (result) {

            console.log('\n\n第'+(index+1)+'波已发送完毕\n');

            perTranscationDidComplete = true;

            //判断是否已经发送完最后一批
            if(didSendLastAirdropList){
                console.log("\n全部发送完毕!!!\n\n");

                //回调空投结果
                airdropResultCall(true);

                listen.stopListen();
            }
            else {
                console.log('\n开始第' + (index+2) + '波空投地址\n\n');
                startHandleAirdrop(index+1);
            }
        });
    },function (success) {

        perTranscationDidComplete = true;

        console.log("Transaction Success:\n"+success);
    },function (error) {

        console.log("Failure to send a signature transaction:\n"+error);


        let judgeStr = error.toString();

        let notMind = 'not mined';

        if (judgeStr.indexOf(notMind) == -1){

            perTranscationDidComplete = true;
        }

        let underpriced = 'underpriced';
        if (judgeStr.indexOf(underpriced) != -1) {
                
            console.log('重新发送此次交易');

            startHandleAirdrop(index);
        }else{

            airdropResultCall(false);
        }

        //回调空投结果
        listen.stopListen();
    });
}

const airdropListManager = require('../filemanger/airdropListManager');

function startAirdrop(filePath,addressIndex,amountIndex,addressNeedJudgeRepeat,resultCall){

    // get list
    airdropListManager.getAirdropList(filePath,addressIndex,amountIndex,addressNeedJudgeRepeat,function (addresses,amounts) {

        if (addresses.length === 0 || amounts.length === 0){

            console.log('空投列表数据读取错误');

            resultCall(false);

            return;
        }

        console.log('此次空投：'+addresses+'\n共计：'+addresses.length);

        transferWithAddressAndAmounts(addresses,amounts,resultCall);
    });
}

function sendLastPartAirdrop(){

    needSendLastList = true;
}

module.exports = {
    startAirdrop,
    sendLastPartAirdrop
};
