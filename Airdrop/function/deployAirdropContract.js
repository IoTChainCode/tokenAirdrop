const deploy = require('./base/delpoy');

const contractPath = '../contract/airdrop.sol';

const contractName = 'TokenAirDrop';

deploy.deployContract(contractPath,contractName,null,function (success) {

    console.log('\ndeployConverterSuccess!!!  \nblockHash：'+ success.transactionHash +' \ncontractAddress：'+success.contractAddress);

},function (error) {

    console.log("error:"+JSON.stringify(error));
});