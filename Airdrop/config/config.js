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

//以太坊main网络参数
// module.exports = {
//     internetType:'main',
//     transaction:{
//         url:'https://mainnet.infura.io',
//         gasPrice:2000000000,
//         gasLimit:6000000
//     },
//     airdropModule: {
//         userPrivateKey:'',                                     //send transaction
//         ercAirDropAmount:'0.1',       //amount of airdrop
//         airdropContractAddress:'0xc3695ff043d9ad015dd3b6141ee4de0a7051204c',
//         tokenContractAddress:'0x5e6b6d9abad9093fdc861ea1600eba1b355cd940',                               //erc20 token contract address
//         transferFromAddress:'0xf5D0318dbb21755B4866CF10bA7f8843F0BD11bf'
//     },
//     approveModule:{
//         userPrivateKey : '',
//         amount : '5000',             //The amount of contract transferable accounts
//         airdropContractAddress : '0xc3695ff043d9ad015dd3b6141ee4de0a7051204c',                             //airdrop contract address
//         tokenContractAddress : '0x5e6b6d9abad9093fdc861ea1600eba1b355cd940'
//     },
//     deployModule:{
//         userPrivateKey : ''
//     }
// };

//以太坊Rinkeby网络参数
module.exports = {
    internetType:'rinkeby',
    transaction:{
        url         :'https://rinkeby.infura.io/0x585a40461ff12c6734e8549a7fb527120d4b8d0d',
        gasPrice    : 5000000000,
        gasLimit    : 6000000
    },
    airdropModule: {
        userPrivateKey          :'1311795de329cf9e8debd6441eae1437122e0bddf28911f8b6d770dc46a3b0e8',                                     //send transaction
        ercAirDropAmount        :'1',       //amount of airdrop
        airdropContractAddress  :'0x7a8cBfaA4bE827c834DFefae367c9535634f9B9D',
        tokenContractAddress    :'0xc0eE6Df91C455c64928F1F179C2B84eb61E58870',                               //erc20 token contract address
        transferFromAddress     :'0x585a40461FF12C6734E8549A7FB527120D4b8d0D'
    },
    approveModule:{
        userPrivateKey          : '1311795de329cf9e8debd6441eae1437122e0bddf28911f8b6d770dc46a3b0e8',
        amount                  : '5000',             //The amount of contract transferable accounts
        airdropContractAddress  : '0x7a8cBfaA4bE827c834DFefae367c9535634f9B9D',                             //airdrop contract address
        tokenContractAddress    : '0xc0eE6Df91C455c64928F1F179C2B84eb61E58870'
    },
    deployModule:{
        userPrivateKey : '1311795de329cf9e8debd6441eae1437122e0bddf28911f8b6d770dc46a3b0e8'
    },
    filePath:{
        totalAirdropListPath    : './airdrop_list/itc_airdrop_total.xlsx',
        awardsAirdropListPath   : './airdrop_list/awards.xlsx',
        errorAirdropListPath    : './airdrop_list/errorAddress.xlsx',
        airdropRecoderListPath  : './airdrop_list/airdropRecoderList.xlsx',
    }
};
