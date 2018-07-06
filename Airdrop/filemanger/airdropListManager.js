let excelManager = require('./excelHandleManager');

/*
* filepath 文档路径
* addressIndex      地址的序列
* amountIndex       数量的序列
* needJudgeRepeat   是否需要判断去重
* result            结果回调
* */
function getAirdrop(filepath,addressIndex,amountIndex,needJudgeRepeat,result) {


    let listData = excelManager.readExcelContent(filepath);

    let repeatAirdropAddressIndexs = [];

    if (needJudgeRepeat){

         repeatAirdropAddressIndexs = getRepeatAccount(listData,addressIndex);
    }
    
    console.log('repeatAirdropAddressIndexs：\n'+repeatAirdropAddressIndexs);

    let airdropList = [];
    let amountArr = [];
    let invalidAirdropList = [];
    let repeatList = [];

    //start index
    let destinationStartIndex = 0;
    //max amount
    const  maxLength = 10000;

    for (let i in listData){

        //第一行为标题
        if(i === 0){
            continue;
        }

        if(i < destinationStartIndex){
            continue;
        }

        if(i === destinationStartIndex + maxLength){
            break;
        }

        //repeat token Address
        if(repeatAirdropAddressIndexs.indexOf(i) !== -1){

            let arr = listData[i];
            repeatList.push(arr);
            continue;
        }

        let arr = listData[i];
        let addressObj = arr[addressIndex];
        let amount = arr[amountIndex];
        
        if(addressObj.length === 42){
            airdropList.push(addressObj);
            amountArr.push(amount);
        }
        else {
            invalidAirdropList.push(arr);
        }
    }

    console.log('airdropListAccount:'+airdropList.length);
    console.log('repeatAccountAmount:'+repeatList.length);
    console.log('invalidAccountAmount:'+invalidAirdropList.length+'\n');

    result(airdropList,amountArr);
}

function getRepeatAccount(dataArr,addressIndex) {

    let airdropList = [];
    let repeatAirdropAddressIndexs = [];

    //return repeatAirdropAddressIndexs;
    for (let i in dataArr){

        let arr = dataArr[i];
        let obj = arr[addressIndex];

        if (airdropList.indexOf(obj) === -1){

            airdropList.push(obj);
        }
        else {
            repeatAirdropAddressIndexs.push(i);
        }
    }

    return repeatAirdropAddressIndexs;
}

module.exports = {

    getAirdropList:getAirdrop
};