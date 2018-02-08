/**
 * Created by zhaoyiyu on 2018/2/3.
 */
require('web3');
require('ethereumjs-tx');
require('solc');
require('ethjs-account');
require('node-xlsx');

console.log('require librarys');

//以太坊main网络参数
module.exports = {
    transaction:{
        url:'https://mainnet.infura.io',
        gasPrice:3000000000,
        gasLimit:6000000
    },
    airdropModule: {
        userPrivateKey:'',                                     //send transaction
        ercAirDropAmount:'1',       //amount of airdrop
        airContractAddress:'',
        tokenContractAddress:'',                               //erc20 token contract address
        transferFromAddress:''
    },
    approveModule:{
        userPrivateKey : '',
        amount : '2000',             //The amount of contract transferable accounts
        airdropApproveAddress : '',                             //airdrop contract address
        tokenContractAddress : ''
    },
    deployModule:{
        userPrivateKey : ''
    }
};

