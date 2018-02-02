# ERC20TokenAridrop
This project can be used for all ERC20 based tokens for airdrop distribution！

——- dependency library
npm install web3 solc ethereumjs-tx ethjs-account --save

--- deploy.js
This deploy.js can help you deploy the contract，you need set 'contractPath' and 'userPrivateKey' ,then run the deploy.js ,
The contract address will be printed on the console and save the contract address in your file！

--- approve.js
This approve.js can help you authorize the airdrop contract address to use your specified number of tokens from your account;
you need set 'amount','airdropApproveAddress','userPrivateKey' and 'tokenContractAddress';
then run approve.js , it will print the txHash and transfer result;

--- airdrop.js
This airdrop.js is an executive document of the airdrop contract. you should initialize the parameters in the file and run airdrop.js.
the airdrop result will be printed on the console.

The airdrop sequence is as follows:
1. Deploy ERC20Token contract and airdrop contract.
2. Approve enough ERC20 tokens to the airdrop contract.
3. Compile a list of reciepient addresses and store them in 'airdropList.txt' file.
4. Run 'airdrop.js' script.
5. You can look the airdrop result on the console or check the txHash in 'https://etherscan.io';

