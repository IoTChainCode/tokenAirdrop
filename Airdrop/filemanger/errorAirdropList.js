/**
 * Created by zhaoyiyu on 2018/2/13.
 */

var excelManager = require('./excelHandleManager');

function getErrorAddressList(airdropListFilePath,errorAddressListPath,addressIndex) {

    var data = excelManager.readExcelContent(airdropListFilePath);
    var writeFileContent = [];

    for (var i in data){

        var arr = data[i];
        var obj = arr[addressIndex];
        if (obj.length !== 42 && writeFileContent.indexOf(arr) === -1) {
            writeFileContent.push(arr);
        }
    }

    excelManager.writeDataToExcel(writeFileContent,errorAddressListPath);
}

var Config = require('./../config/config.js');

var errorAirdropListPath = Config.filePath.errorAirdropListPath;
var totalAirdropListPath = './itc_airdrop_total.xlsx';
var addressIndex = 3;


getErrorAddressList(totalAirdropListPath,errorAirdropListPath,addressIndex);