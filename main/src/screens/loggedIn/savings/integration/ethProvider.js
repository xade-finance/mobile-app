import depositContractABI from './deposit.json';
import xusdABI from './XUSD.json';
import liquidityPoolABI from './LiquidityPool.json';
// import balanceSheetABI from "./balancesheet.json";
// import { SafeEventEmitterProvider } from "@web3auth/base";
// import Web3 from "web3";
// import { IWalletProvider } from "./walletProvider";
// import { newKitFromWeb3, CeloContract } from "@celo/contractkit";
// import CUSD from "./CUSD.json";
// import { Any } from "io-ts";
// import { IntegerType } from "mongodb";
var done = false;
const liquidityPoolAddress = '0xbC02B2D6b69e33361b28F6dfF5812b908B89Bea8';
const ethProvider = ({web3}) => {
  const getUserPoolBalance = async () => {
    try {
      //deposit contract address
      // const liquidityPoolAddress = "0xBdbb4B32AC5775F3f4621E3C12e246D8B00fE1ed";
      const contract = new web3.eth.Contract(
        liquidityPoolABI,
        liquidityPoolAddress,
      );
      let accounts = await web3.eth.getAccounts();
      console.log(accounts[0]);
      const balance = await contract.methods
        .userDepositedCUSD(accounts[0])
        .call();
      console.log('Balance:', balance);
      return web3.utils.fromWei(balance, 'ether');
    } catch (error) {
      console.error('Error', error);
    }
  };

  const xusdAddr = '0xA3C957f5119eF3304c69dBB61d878798B3F239D9';
  const approveXUSD = async amount => {
    try {
      // const web3 = new Web3(provider);
      // const kit = newKitFromWeb3(web3);
      let accounts = await web3.eth.getAccounts();
      console.log('Accounts: ', accounts);
      // kit.defaultAccount = accounts[0];
      // const liquidityPoolAddress = "0xBdbb4B32AC5775F3f4621E3C12e246D8B00fE1ed";
      const contractAddr = '0xA3C957f5119eF3304c69dBB61d878798B3F239D9';
      const contract = new web3.eth.Contract(xusdABI, contractAddr);
      console.log('Contract:', contract);
      const txRes = await contract.methods
        .approve(
          liquidityPoolAddress,
          web3.utils.toBN(web3.utils.toWei(amount, 'ether')),
        )
        .send({
          from: accounts[0],
          gas: 80000,
          maxPriorityFeePerGas: '5000000000', // Max priority fee per gas
          maxFeePerGas: '6000000000000',
        });
      console.log(txRes);
      return txRes;
    } catch (error) {
      console.log('Could not process transaction! : approveXUSD');
      console.log('error', error);
      return false;
    }
  };
  const provideLiquidityToContract = async amount => {
    let approveReceipt = await approveXUSD(amount);
    console.log('Approved:', approveReceipt);
    if (approveReceipt.status) {
      try {
        // const web3 = new Web3(provider);
        // const kit = newKitFromWeb3(web3);

        let accounts = await web3.eth.getAccounts();
        // kit.defaultAccount = accounts[0];
        // const liquidityPoolAddress =
        //   "0xBdbb4B32AC5775F3f4621E3C12e246D8B00fE1ed";
        const contract = new web3.eth.Contract(
          liquidityPoolABI,
          liquidityPoolAddress,
        );

        const txRes = await contract.methods
          .depositERC20Token(web3.utils.toBN(web3.utils.toWei(amount, 'ether')))
          .send({
            from: accounts[0].toLowerCase(),
            gas: 80000,
            maxPriorityFeePerGas: '5000000000', // Max priority fee per gas
            maxFeePerGas: '6000000000000',
          });
        console.log(txRes);
        // uiConsole("Receipt", txRes);
        return txRes;
      } catch (error) {
        console.log('Could not process transaction! : provideLiquidity');
        console.log('error', error);
        return false;
      }
    }
  };

  const withdrawAmount = async amount => {
    // const liquidityPoolAddress = "0xBdbb4B32AC5775F3f4621E3C12e246D8B00fE1ed";
    // const web3 = new Web3(provider );
    // const kit = newKitFromWeb3(web3);
    let accounts = await web3.eth.getAccounts();
    // kit.defaultAccount = accounts[0];
    const liquidityPool = new web3.eth.Contract(
      liquidityPoolABI,
      liquidityPoolAddress,
    );
    console.log('amount value in ethProvider===', amount);
    const txRes = await liquidityPool.methods
      .withdrawERC20Token(web3.utils.toBN(web3.utils.toWei(amount, 'ether')))
      .send({
        from: accounts[0],
        gas: 80000,
        maxPriorityFeePerGas: '5000000000', // Max priority fee per gas
        maxFeePerGas: '6000000000000',
      });
    // uiConsole("Receipt", txRes);
    console.log(parseInt(amount) * 10);
    if (txRes.status == '0x1' || txRes.status == 1) {
      console.log(`${txRes.status} Transaction Success`);
      return txRes;
    } else {
      console.log(`${txRes.status} Transaction Failed`);
      return false;
    }
  };

  return {
    // getAccounts,
    // getBalance,
    // signAndSendTransaction,
    // readAddress,
    // getSavingInterestRate,
    provideLiquidityToContract,
    withdrawAmount,
    getUserPoolBalance,
  };
};

export default ethProvider;
