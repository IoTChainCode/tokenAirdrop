/**
 * Created by zhaoyiyu on 2018/3/22.
 */

var sd = require('silly-datetime');

var WebSocket = require('ws');
var ws ;
var Config = require('./../config/config.js');

Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(Config.transaction.url));

//airdrop contract address
var airContractAddress = Config.airdropModule.airdropContractAddress;
var networkType = Config.internetType;

//heartbeat Number
var intervalNumber ;

//transcation result callback
var hashSuccessBlock ;

//judge hashId
var listenHashId = '';

//------------------------------ Websocket function --------------------------

if (networkType == 'main'){

    ws = new WebSocket("wss://socket.etherscan.io/wshandler");

    //connect open
    ws.onopen = function (e) {
        console.log('Connection to server opened');

        //heartbeat
        intervalNumber = setInterval(function () {

            var ping = '{"event":"ping"}';
            ws.send(ping);
        },18000);

        //start listen
        var sendMsg = `{"event": "txlist", "address":"${airContractAddress}"}`;
        ws.send(sendMsg);
    };

    //connect closed
    ws.onclose = function (e) {
        console.log('connection closed.');

        //stop heartbeat
        clearInterval(intervalNumber);
    };

    //connect error
    ws.onerror = function (e) {
        console.log('error:'+ e);
    };

    //receive message
    ws.onmessage = function(event) {
        var time=sd.format(new Date(),'YYYY-MM-DD HH:mm:ss');
        console.log(time + ': Client received a message' + event.data);

        if (listenHashId.length != 0){

            var data = event.data;
            if (data.indexOf(listenHashId) > 0){

                hashSuccessBlock();
            }
        }
    };
}

//------------------------------ API --------------------------
var listenAirdropStatus = function(parameter,result) {
    listenHashId = parameter.hashId;
    hashSuccessBlock = result;

    if (networkType == 'rinkeby'){

        startRinkebyListen(parameter.tokenAbi,parameter.tokenAddress,parameter.fromAddress);
    }
};

function startRinkebyListen(tokenAbi,tokenAddress,fromAddress) {

    var tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);

    console.log('start test network listen');

    //10秒轮询一次
    intervalNumber = setInterval(function () {

        web3.eth.getBlockNumber().then(function (fromBlockNumber ) {

            var time=sd.format(new Date(),'YYYY-MM-DD HH:mm:ss');
            console.log(time+':current search blockNumber->'+fromBlockNumber);

            tokenContract.getPastEvents('Transfer', {
                fromBlock: fromBlockNumber,
                filter: {from:fromAddress}
            }, function(error, events){

                //console.log(events);
                var event = events[0];
                console.log('\nevent:'+event);

                if (event != null){


                    if (event.transactionHash == listenHashId){

                        console.log('监听到hashId相符合的交易');

                        //stop heartbeat
                        clearInterval(intervalNumber);

                        //5秒后回调
                        setTimeout(function () {
                            hashSuccessBlock();
                        },5000);
                    }
                }
            });
        });

    },10000);
}


var stopListen = function () {

    if (networkType == 'rinkeby') {
        clearInterval(intervalNumber);
    }else {
        ws.close();
    }

};

module.exports = {
    startListenAirdropResult:listenAirdropStatus,
    stopListen:stopListen
};

