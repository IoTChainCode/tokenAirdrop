/**
 * Created by zhaoyiyu on 2018/3/28.
 */

var xlsx = require('node-xlsx');
var fs = require('fs');

function readFile(path){

    //parse
    var obj = xlsx.parse(path);
    var excelObj=obj[0].data;
    //console.log(excelObj);

    var data = [];
    for(var i in excelObj){
        var arr=[];
        var value=excelObj[i];
        for(var j in value){
            arr.push(value[j]);
        }
        data.push(arr);
    }

    return data;
}


function writeDataSync(data,path) {

    var buffer = xlsx.build([
        {
            name:'sheet1',
            data:data
        }
    ]);

    fs.writeFileSync(path,buffer,{'flag':'w'});
}

function appendData(data,path){
    var fs = require('fs');

    fs.exists(path,function (didExists) {

        if (didExists === false){

            console.log("need init recoder");

            var titleArr = [["Address","Amount"]];
            writeDataSync(titleArr,path)
        }


        var originalData = readFile(path);
        var appendData = originalData.concat(data);

        writeDataSync(appendData,path)
    });

}

module.exports = {

    readExcelContent:readFile,
    writeDataToExcel:writeDataSync,
    recoderAirdrop:appendData
};