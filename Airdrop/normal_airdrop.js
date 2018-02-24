/**
 * Created by zhaoyiyu on 2018/2/7.
 */

const airdropList = require('./airdrop_list/airdropList.js');
const airdrop = require('./function/airdrop');
const Config = require('./config/config.js');

airdropList.normalAirdrop(function (addresses) {

    if (addresses.length == 0){
        return;
    }

    //amount of airdrop
    const ercAirDropAmount = Config.airdropModule.ercAirDropAmount;

    var amounts = [];
    for (var i = 0 ; i < addresses.length ; i ++){
        amounts.push(ercAirDropAmount);
    }
    console.log(addresses);

    airdrop.transferTool(addresses,amounts);
});