const deploy = require('../base/delpoy');

const contractPath = '../../contract/converter.sol';

const parameter = ['0xcf3774e690544a0741Ad31C89Bd4BD490faaE3B1','0xF46002C37af6fb078aE1833Fd447698A0C9012F7','30000','0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',500000];

const contractName = 'BancorConverter';

deploy.deployContract(contractPath,contractName,parameter,function (success) {

    console.log('\ndeployConverterSuccess!!!  \nblockHash：'+ success.transactionHash +' \ncontractAddress：'+success.contractAddress);

},function (error) {

    console.log("error:"+JSON.stringify(error));
});

/*
deploySmartTokenSuccess!!!
blockHash：0x6beb8c85bc9ee7c08ac9c01c4d5a29b2f2de3dcf5e8a873740da38c6fac71c60
contractAddress：0x5e04821d5Af7616f37Bf13bcD920571635d4989B
* */