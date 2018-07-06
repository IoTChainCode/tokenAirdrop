/**
 * Created by zhaoyiyu on 2018/1/30.
 */
const fs = require('fs');
const solc = require('solc');

const Config = require('../../config/config');
Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(Config.transaction.url));

const transaction = require('./transaction');

function startDeployContract(contractPath,contractName,extraParameter,success,error) {

// compile the code
    const input = fs.readFileSync(contractPath);
    const output = solc.compile(input.toString());

    const name = ':'+contractName;

    let bytecode = output.contracts[name].bytecode;

    if (extraParameter != null){

        const abi = JSON.parse(output.contracts[name].interface);
        let contract = new web3.eth.Contract(abi,'0x0000000000000000000000000000000000000000');

        let  parameter = {
            data:bytecode,
            arguments:extraParameter
        };

        bytecode = contract.deploy(parameter).encodeABI();
    }

    let t = {
        value: '0x00',
        data: ('0x'+bytecode),
    };

    transaction.startTransaction(t,null,success,error);
}


module.exports = {
  deployContract:startDeployContract
};