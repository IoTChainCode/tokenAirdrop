
let excelManager = require('./excelHandleManager');
let fs = require('fs');


function createRandomAwardsList(originalListPath,addressIndex,result){

    
    fs.exists(awardsAirdropListPath,function (didExists) {

        console.log(didExists);
        if (didExists === false){

            createRandomAward();
            console.log('Generated awards list has been generated！');
        }

        console.log('did create awards list , if you want to create a new awards list ,please delete the old one');
    });
}


function createRandomAward(originalListPath,addressIndex){

    //read xlsx data
    let data = excelManager.readExcelContent(originalListPath);

    let airdropList = [];
    let nameList = [];

    let totolaName = [];

    for (let i in data){

        let arr = data[i];
        let obj = arr[addressIndex];
        if (airdropList.indexOf(obj) === -1 && obj.length === 42) {

            airdropList.push(obj);
            nameList.push(arr[1]);
        }

        totolaName.push(arr[1]);
    }

    let amountsArr = [];
    let accountsArr = [];

    //recoderArr
    let writeFileContent = [['Name','Rwards','Amount','sequence','Token Address']];

    //500个一等奖  20个二等奖  1个一等奖
    for (let i = 0; i < 500 + 20 + 1 ; i ++) {

        let content = [];

        while (1){
            let j = GetRandomNum(0, airdropList.length - 1);
            //console.log('random' + j);

            let obj = airdropList[j];

            if (accountsArr.indexOf(obj) === -1) {

                let name = nameList[j];
                content.push(name);

                let amount = '4';
                let awardName = 'Third prize';
                if (i === 0) {
                    amount = '499';
                    awardName = 'First prize';
                }
                else if (i < 21) {
                    amount = '49';
                    awardName = 'Second prize';
                }

                amountsArr.push(amount);
                content.push(awardName);
                content.push(amount);

                let index = totolaName.indexOf(name);

                content.push(index);

                accountsArr.push(obj);
                content.push(obj);
                break;
            }
        }


        writeFileContent.push(content);
    }

    //记录
    excelManager.writeDataToExcel(writeFileContent,awardsAirdropListPath);
};


function GetRandomNum(Min,Max)
{
    let Range = Max - Min;
    let Rand = Math.random();
    return(Min + Math.round(Rand * Range));
}


module.exports = {

    createRandomAwardsList
};