/**
 * Created by zhaoyiyu on 2018/1/30.
 */

const transaction = require('./transaction');

function executeFunction(toAddress,functionABI,getHashIdCall,success,error) {

    let t = {
        to:toAddress,
        value: '0x00',
        data: functionABI
    };

    transaction.startTransaction(t,getHashIdCall,success,error);
}

function executeFunctionWithExtraEth(toAddress,functionABI,value,getHashIdCall,success,error) {

    let t = {
        to:toAddress,
        value: value,
        data: functionABI
    };

    transaction.startTransaction(t,getHashIdCall,success,error);
}

module.exports = {
    executeFunction,
    executeFunctionWithExtraEth
};