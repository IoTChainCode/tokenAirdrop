/**
 * Created by zhaoyiyu on 2018/2/7.
 */

var airdropList = require('./airdrop_list/airdropList.js');
var airdrop = require('./function/airdrop');

airdropList.awardAridropList(function (addresses,amonuts) {

    console.log('addresses:\n'+addresses+'\namounts:\n'+amonuts);
    
    airdrop.transferTool(addresses,amonuts);
});

