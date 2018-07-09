/**
 * Created by zhaoyiyu on 2018/2/3.
 */
require('web3');
require('ethereumjs-tx');
require('solc');
require('ethjs-account');
require('node-xlsx');
require('silly-datetime');
require('ws');

console.log('require librarys');

//itc 主空投账户
const userConfig_main = {
    userPrivateKey:'',
    userAddress:'0xf5D0318dbb21755B4866CF10bA7f8843F0BD11bf',
    airdropContractAddress:'0xc3695ff043d9ad015dd3b6141ee4de0a7051204c'

};

//Ethereum Rinkeby 测试账户
const userConfig_rinkeby = {
    userPrivateKey:'1311795de329cf9e8debd6441eae1437122e0bddf28911f8b6d770dc46a3b0e8',
    userAddress:'0xfdbc38257a9507d9329c2e203bce7a9b0b63f871',
    airdropContractAddress:'0x7a8cBfaA4bE827c834DFefae367c9535634f9B9D'
};

let userConfig = userConfig_rinkeby;
// let userConfig = userConfig_main;

//主网
mainnetConfig = {
    internetType:'main',
    userModule:{
        userPrivateKey:userConfig.userPrivateKey,
    },
    tokenholderStartBlock:userConfig.startBlock,
    transaction:{
        url:'https://mainnet.infura.io',
        gasPrice:20000000000,
        gasLimit:6000000
    },
    airdropModule: {
        ercAirDropAmount:'1',       //amount of normal airdrop
        airdropContractAddress:userConfig.airdropContractAddress,                             //
        tokenContractAddress:'0x5e6b6d9abad9093fdc861ea1600eba1b355cd940',                               //erc20 token contract address
    },
    approveModule:{
        amount : '5000',             //The amount of contract transferable accounts
        approveAddress : userConfig.airdropContractAddress,                             //airdrop contract address
        tokenContractAddress : '0x5e6b6d9abad9093fdc861ea1600eba1b355cd940',                       //erc20 token contract address
    },
};

//rinkeby网络
rinkebyConfig = {
    internetType:'rinkeby',
    userModule:{
        userPrivateKey:userConfig.userPrivateKey,
    },
    tokenholderStartBlock:userConfig.startBlock,
    transaction:{
        url:'https://rinkeby.infura.io/0x585a40461ff12c6734e8549a7fb527120d4b8d0d',
        gasPrice:50000000000,
        gasLimit:6000000
    },
    airdropModule: {
        ercAirDropAmount:'1',       //amount of normal airdrop
        airdropContractAddress:userConfig.contractAddress,                             //
        tokenContractAddress:'0xc0eE6Df91C455c64928F1F179C2B84eb61E58870',                               //erc20 token contract address
    },
    approveModule:{
        amount : '5000',             //The amount of contract transferable accounts
        approveAddress : userConfig.contractAddress,                             //airdrop contract address
        tokenContractAddress : '0xc0eE6Df91C455c64928F1F179C2B84eb61E58870',                       //erc20 token contract address
    },
};

module.exports = rinkebyConfig;
// module.exports = mainnetConfig;

