import AsyncStorage from '@react-native-async-storage/async-storage';
import BigNumber from 'bignumber.js';
import {Buffer} from 'buffer';
import {EvmService} from './NetService/EvmService';

const Web3 = require('web3');

export async function getEvmTokenTransaction(sender, receiver, amount) {
  const mainnetJSON = await AsyncStorage.getItem('mainnet');
  const mainnet = JSON.parse(mainnetJSON);
  const contractAddress = mainnet
    ? '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
    : '0xA3C957f5119eF3304c69dBB61d878798B3F239D9';

  if (mainnet) {
    amount = String(parseFloat(Web3.utils.fromWei(amount)) * 10 ** 6);

    const data = await EvmService.erc20Transfer(
      contractAddress,
      receiver,
      amount,
    );

    console.log(`data = ${data}`);
    const gasLimit = await EvmService.estimateGas(
      sender,
      contractAddress,
      '0x0',
      data,
    );
    console.log(`gasLimit = ${gasLimit}`);
    const gasFeesResult = await EvmService.suggeseGasFee();
    console.log(gasFeesResult);

    const maxFeePerGas = gasFeesResult.high.maxFeePerGas;
    console.log(maxFeePerGas);

    const maxFeePerGasHex =
      '0x' + BigNumber(maxFeePerGas * Math.pow(10, 9)).toString(16);

    const maxPriorityFeePerGas = gasFeesResult.high.maxPriorityFeePerGas;
    console.log(maxPriorityFeePerGas);

    const maxPriorityFeePerGasHex =
      '0x' + BigNumber(maxPriorityFeePerGas * Math.pow(10, 9)).toString(16);

    const chainId = mainnet ? 137 : 80001;
    console.log(chainId);

    const transaction = {
      from: sender,
      to: contractAddress,
      data: data,
      gasLimit: gasLimit,
      value: '0x0',
      type: '0x2',
      chainId: '0x' + chainId.toString(16),
      maxPriorityFeePerGas: maxPriorityFeePerGasHex,
      maxFeePerGas: maxFeePerGasHex,
    };

    console.log(transaction);
    const json = JSON.stringify(transaction);
    const serialized = Buffer.from(json).toString('hex');
    return '0x' + serialized;
  } else {
    console.log('Works');

    console.log(
      `sender = ${sender}, receiver = ${receiver}, amount = ${amount}`,
    );
    const data = await EvmService.erc20Transfer(
      contractAddress,
      receiver,
      amount,
    );

    console.log(data);
    const gasLimit = await EvmService.estimateGas(
      sender,
      contractAddress,
      '0x0',
      data,
    );
    console.log(gasLimit);
    const gasFeesResult = await EvmService.suggeseGasFee();
    console.log(gasFeesResult);

    const maxFeePerGas = gasFeesResult.high.maxFeePerGas;
    console.log(maxFeePerGas);

    const maxFeePerGasHex =
      '0x' + BigNumber(maxFeePerGas * Math.pow(10, 9)).toString(16);

    const maxPriorityFeePerGas = gasFeesResult.high.maxPriorityFeePerGas;
    console.log(maxPriorityFeePerGas);

    const maxPriorityFeePerGasHex =
      '0x' + BigNumber(maxPriorityFeePerGas * Math.pow(10, 9)).toString(16);

    const chainId = mainnet ? 137 : 80001;
    console.log(chainId);

    const transaction = {
      from: sender,
      to: contractAddress,
      data: data,
      gasLimit: gasLimit,
      value: '0x0',
      type: '0x2',
      chainId: '0x' + chainId.toString(16),
      maxPriorityFeePerGas: maxPriorityFeePerGasHex,
      maxFeePerGas: maxFeePerGasHex,
    };

    console.log(transaction);
    const json = JSON.stringify(transaction);
    const serialized = Buffer.from(json).toString('hex');
    return '0x' + serialized;
  }
}

