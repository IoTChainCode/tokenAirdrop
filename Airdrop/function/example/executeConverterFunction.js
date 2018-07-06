
const fs = require('fs');
const solc = require('solc');

const Config = require('../../config/config');

const contractPath = '../../contract/converter.sol';
const contractName = 'BancorConverter';

Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(Config.transaction.url));

const input = fs.readFileSync(contractPath);
const output = solc.compile(input.toString());
const name = ':'+contractName;

const abi = JSON.parse(output.contracts[name].interface);

const tokenContractAddress = '0x5e04821d5Af7616f37Bf13bcD920571635d4989B';

let token = new web3.eth.Contract(abi, tokenContractAddress);

let execute = require('../base/execute');

// executeAddConnector();
// executeSetConversionFee();
//executeSetQuickBuyPath();
executeWithdrawTokens();

function executeAddConnector(){

    let  functionABI = token.methods.addConnector('0x5E6b6d9aBAd9093fdc861Ea1600eBa1b355Cd940',
        500000,false).encodeABI();

    execute.executeFunction(tokenContractAddress,functionABI,function (hashId) {

        console.log('execute addConnector hashId->',hashId);
    },function (success) {

        console.log('execute addConnector success');
    },function (error) {

        console.log('execute addConnector error');
    });
}

function executeSetConversionFee(){

    let  functionABI = token.methods.setConversionFee(1420).encodeABI();

    execute.executeFunction(tokenContractAddress,functionABI,function (success) {

        console.log('execute setConversionFee success');
    },function (error) {

        console.log('execute setConversionFee error');
    });
}


function executeSetQuickBuyPath(){

    const parmeter = [
        '0xc0829421C1d260BD3cB3E0F06cfE2D52db2cE315',
        '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
        '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
        '0xcf3774e690544a0741Ad31C89Bd4BD490faaE3B1',
        '0x5E6b6d9aBAd9093fdc861Ea1600eBa1b355Cd940'
    ];

    let  functionABI = token.methods.setQuickBuyPath(parmeter).encodeABI();

    execute.executeFunction(tokenContractAddress,functionABI,function (success) {

        console.log('execute setQuickBuyPath success');
    },function (error) {

        console.log('execute setQuickBuyPath error');
    });
}

function executeWithdrawTokens(){

    let  functionABI = token.methods.withdrawTokens('0xc0eE6Df91C455c64928F1F179C2B84eb61E58870','0x5E6b6d9aBAd9093fdc861Ea1600eBa1b355Cd940',33 * 100000 * 100000 * 100000 * 1000).encodeABI();

    execute.executeFunction(tokenContractAddress,functionABI,function (success) {

        console.log('execute withdrawTokens success');
    },function (error) {

        console.log('execute withdrawTokens error');
    });
}