/**
 * Created by zhaoyiyu on 2018/3/22.
 */

const sd = require('silly-datetime');

const WebSocket = require('ws');
const ws = new WebSocket("wss://socket.etherscan.io/wshandler");
const Config = require('./../config/config.js');

//airdrop contract address
const airContractAddress = Config.airdropModule.airdropContractAddress;

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
var listenAirdropStatus = function(hashId,result) {
    listenHashId = hashId;
    hashSuccessBlock = result;
};


var stopListen = function () {
    ws.close();
};

module.exports = {
    startListenAirdropResult:listenAirdropStatus,
    stopListen:stopListen
};

