# ERC20TokenAridrop
This project can be used for all ERC20 based tokens for airdrop distribution！
1. A single transmission can support up to two hundred transfers.
2. Realize the monitoring transaction status and automatically send the next one.
3. The implementation fee is reduced to 0.000045--0.00007 eth/transcation.


——- dependency library
npm install web3 solc ethereumjs-tx ethjs-account node-xlsx --save

--- deploy.js
This deploy.js can help you deploy the contract，you need set 'contractPath' and 'userPrivateKey' ,then run the deploy.js ,
The contract address will be printed on the console and save the contract address in your file！

--- approve.js
This approve.js can help you authorize the airdrop contract address to use your specified number of tokens from your account;
you need set 'amount','airdropApproveAddress','userPrivateKey' and 'tokenContractAddress';
then run approve.js , it will print the txHash and transfer result;

--- airdrop.js
This airdrop.js is an executive document of the airdrop contract.

--- config.js
This config.js is the config file, contain 'airdropModule','approveModule','deployModule';

--- normal_airdrop.js
First of all,you need initialize the parameters in the config file , then run normal_airdrop.js. airdrop result will be printed on the console.

--- awards_airdrop.js
This file is used to generate random award lists and airdrop ERC20Token to the  award-winning addresses.

The airdrop sequence is as follows:
1. Deploy ERC20Token contract and airdrop contract.
2. Approve enough ERC20 tokens to the airdrop contract.
3. Compile a list of reciepient addresses and store them in 'airdropList.txt' file.
4. Run 'normal_airdrop.js' script.
5. You can look the airdrop result on the console or check the txHash in 'https://etherscan.io';

If you are not familiar with the smart contract, then follow the steps below!
1. npm install web3 solc ethereumjs-tx ethjs-account ws silly-datetime --save
2. Config your userPrivateKey in config.js ->deployModule->userPrivateKey
3. Run deploy.js , then you will get the result on console ,like this:

/*
deploySuccess!!!
blockHash：0x598ecb89d6d999d56fb0f5d4078d1b6b424aadabb09a7a0037b32911374bad68
contractAddress：0xceCf9E39E17330fF5e802895aaa5Bd02614313Bd
**/
4. copy the contractAddress on the console, and paste it in config.js ->approveModule->airdropApproveAddress
5. Config your tokenContractAddress and userPrivateKey in config.js ->approveModule. this userPrivateKey is the private key of the account which you want to use for transfer token;
6. Run approve.js, then your will get the result on console .
7. Config your parameters in config.js ->airdropModule .
8. update your aridiopList in itc_airdrop_total.xlsx!
9. Run 'normal_airdrop.js' script.
10. You can check the airdrop result on the console or check the txHash in 'https://etherscan.io'.





