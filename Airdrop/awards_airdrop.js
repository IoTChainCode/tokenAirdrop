/**
 * Created by zhaoyiyu on 2018/2/7.
 */

const airdropList = require('./airdrop_list/airdropList.js');
const airdrop = require('./function/airdrop');

airdropList.awardAridropList(function (addresses,amonuts) {

    console.log('addresses:\n'+addresses+'\namounts:\n'+amonuts);

    return;
    airdrop.transferTool(addresses,amonuts);
});

