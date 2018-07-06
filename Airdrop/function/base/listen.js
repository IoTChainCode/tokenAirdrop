/**
 * Created by zhaoyiyu on 2018/3/22.
 */

const sd = require('silly-datetime');

let ws ;
const Config = require('../../config/config.js');

Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(Config.transaction.url));

//airdrop contract address
const airContractAddress = Config.airdropModule.airdropContractAddress;
const networkType = Config.internetType;

//heartbeat Number
var intervalNumber ;

//transcation result callback
var hashSuccessBlock ;

//judge hashId
var listenHashId = '';

//------------------------------ Websocket function --------------------------

function startRinkebyListen(tokenAbi,tokenAddress,fromAddress) {

    var tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);

    console.log('start transaction listen');

    clearInterval(intervalNumber);
    //五秒轮询一次
    intervalNumber = setInterval(function () {

        web3.eth.getBlockNumber().then(function (fromBlockNumber ) {

            var time=sd.format(new Date(),'YYYY-MM-DD HH:mm:ss');
            console.log(time+':current search blockNumber->'+fromBlockNumber);

            tokenContract.getPastEvents('Transfer', {
                fromBlock: fromBlockNumber,
                filter: {from:fromAddress}
            }, function(error, events){

                if (judgeObjCalss(events,'array') === false){

                    return;
                }

                //console.log(events);
                var event = events[0];
                console.log('\nevent:'+event);

                if (event != null){

                    if (event.transactionHash == listenHashId){

                        console.log('监听到hashId相符合的交易:',listenHashId);
                        listenHashId = null;

                        //stop heartbeat
                        clearInterval(intervalNumber);

                        //5分钟后回调
                        setTimeout(function () {
                            hashSuccessBlock();
                        },1000 * 60 * 1);
                    }
                }
            });
        });

    },1000 * 2);
}


function judgeObjCalss(obj,className) {

    if (className.indexOf('arr') !== -1 ){

        return Object.prototype.toString.call(obj) === '[object Array]';
    }
}

//------------------------------ API --------------------------
let listenAirdropStatus = function(parameter,result) {

    listenHashId = parameter.hashId;
    hashSuccessBlock = result;

    startRinkebyListen(parameter.tokenAbi,parameter.tokenAddress,parameter.fromAddress);
};


let stopListen = function () {

    clearInterval(intervalNumber);
};

module.exports = {
    startListenAirdropResult:listenAirdropStatus,
    stopListen:stopListen
};
