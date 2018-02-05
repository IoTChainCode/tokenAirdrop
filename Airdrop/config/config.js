/**
 * Created by zhaoyiyu on 2018/2/3.
 */
require('web3');
require('ethereumjs-tx');
require('solc');
require('ethjs-account');

console.log('require librarys');

module.exports = {
    airdropModule: {
        userPrivateKey:'',                                     //send transaction
        ercAirDropAmount:web3.utils.toWei('1', 'ether'),       //amount of airdrop
        airContractAddress:'',
        tokenContractAddress:'',                               //erc20 token contract address
        transferFromAddress:''
    },
    approveModule:{
        userPrivateKey : '',
        amount : web3.utils.toWei('1000', 'ether'),             //The amount of contract transferable accounts
        airdropApproveAddress : '',                             //airdrop contract address
        tokenContractAddress : ''
    },
    deployModule:{
        userPrivateKey : ''
    }

};
