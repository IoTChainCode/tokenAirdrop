/**
 * Created by zhaoyiyu on 2018/3/22.
 */

const sd = require('silly-datetime');

const WebSocket = require('ws');
var ws;
const Config = require('./../config/config.js');

//airdrop contract address
const airContractAddress = Config.airdropModule.airdropContractAddress;
const networkType = Config.internetType;


//main 忘了
if (networkType == 'main'){
    ws = new WebSocket("wss://socket.etherscan.io/wshandler");
}

//heartbeat Number
var intervalNumber ;

//transcation result callback
var hashSuccessBlock ;

//judge hashId
var listenHashId = '';

//------------------------------ Websocket function --------------------------
//connect open
ws.onopen = function (e) {
    console.log('Connection to server opened');

    //heartbeat
    intervalNumber = setInterval(function () {

        const ping = '{"event":"ping"}';
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

    //两秒轮询一次
    intervalNumber = setInterval(function () {

        tokenContract.getPastEvents('Transfer', {
            fromBlock: 1611890,
            toBlock: 'latest',
            filter: {from:fromAddress}
        }, function(error, events){
            //console.log(events);
            var event = events[0];
            console.log('\n'+event.transactionHash);

            if (event.transactionHash == listenHashId){

                hashSuccessBlock();
                //stop heartbeat
                clearInterval(intervalNumber);
            }
        });
    },2000);

}


var stopListen = function () {
    ws.close();
};

module.exports = {
    startListenAirdropResult:listenAirdropStatus,
    stopListen:stopListen
};

