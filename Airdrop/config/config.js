/**
 * Created by zhaoyiyu on 2018/2/3.
 */
require('web3');
require('ethereumjs-tx');
require('solc');
require('ethjs-account');

console.log('require librarys');

//以太坊main网络参数
module.exports = {
    transaction:{
        url:'https://mainnet.infura.io',
        gasPrice:2000000000,
        gasLimit:4700000
    },
    airdropModule: {
        userPrivateKey:'',                                     //send transaction
        ercAirDropAmount:'1',       //amount of airdrop
        airContractAddress:'0x112A5A6678ad276e861872f034040d48275E4c77',
        tokenContractAddress:'0x5e6b6d9abad9093fdc861ea1600eba1b355cd940',                               //erc20 token contract address
        transferFromAddress:'0xf5D0318dbb21755B4866CF10bA7f8843F0BD11bf'
    },
    approveModule:{
        userPrivateKey : '',
        amount : '1000',             //The amount of contract transferable accounts
        airdropApproveAddress : '0x112A5A6678ad276e861872f034040d48275E4c77',                             //airdrop contract address
        tokenContractAddress : '0x5e6b6d9abad9093fdc861ea1600eba1b355cd940'
    },
    deployModule:{
        userPrivateKey : ''
    }

};
