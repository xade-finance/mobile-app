import createProvider from '../../../particle-auth';
import createConnectProvider from '../../../particle-connect';
import usdAbi from './USDC';
import XUSDAbi from './XUSD';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import {ethers} from 'ethers';
import {REMMITEX_MAINNET_CONTRACT, REMMITEX_TESTNET_CONTRACT} from '@env';
import * as particleConnect from 'react-native-particle-connect';
import {Buffer} from 'buffer';
import {EvmService} from '../../../NetService/EvmService';
import BigNumber from 'bignumber.js';

import * as particleAuth from 'react-native-particle-auth';

import abi from './remmitex';

const Web3 = require('web3');
let web3;

export async function transferUSDC(
  smartAccount,
  _amount,
  _recipient,
  navigation,
  setStatus,
  isAuth,
) {
  const usdcAddress = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';
  const v1Address = '0xc9DD6D26430e84CDF57eb10C3971e421B17a4B65';

  const decimals = 6;

  const amount = ethers.utils.parseUnits(_amount, decimals);
  const recipient = _recipient;

  if (isAuth) {
    setStatus('Calculating Gas In USDC...');

    web3 = this.createProvider();

    const contractGas = Number('90000');
    const approvalGas = Number('60000');
    const gasPrice = await web3.eth.getGasPrice();
    const gas = (contractGas + approvalGas) * gasPrice;
    const gasUSDC = Number(String(gas).substring(0, 5) * 1.15).toFixed(0);
    const totalAmount = Number(amount) + Number(gasUSDC);

    console.log('Total Gas:', web3.utils.fromWei(String(gas), 'ether'));
    console.log(
      'Total Gas In USDC:',
      web3.utils.fromWei(String(gasUSDC), 'mwei'),
    );
    console.log('Total Amount:', totalAmount);

    const usdcAbi = new ethers.utils.Interface(usdAbi);
    const contractAbi = new ethers.utils.Interface(abi);

    let txs = [];

    setStatus('Creating Transactions...');

    try {
      const approveData = usdcAbi.encodeFunctionData('approve', [
        v1Address,
        totalAmount,
      ]);

      const approveTX = {
        to: usdcAddress,
        data: approveData,
      };

      txs.push(approveTX);

      const sendData = contractAbi.encodeFunctionData('transfer', [
        recipient,
        amount,
        gasUSDC,
      ]);

      const sendTX = {
        to: v1Address,
        data: sendData,
      };

      txs.push(sendTX);

      setStatus('Created Transactions Successfully...');

      setStatus('Waiting For Approval...');

      const txResponse = await smartAccount.sendTransactionBatch({
        transactions: txs,
      });

      setStatus('Approved!');

      console.log(txResponse);

      return {
        status: true,
        fees: String(Number(web3.utils.fromWei(gasUSDC, 'mwei')).toFixed(5)),
      };
    } catch (e) {
      console.error(e);

      return {
        status: false,
        fees: JSON.stringify(e),
      };
    }
  } else {
    try {
      setStatus('Waiting For USDC Approval...');

      web3 = this.createConnectProvider();

      const usdcContract = new web3.eth.Contract(usdAbi, usdcAddress);

      const contract = new web3.eth.Contract(abi, v1Address);

      const approval = await usdcContract.methods
        .approve(v1Address, amount)
        .send({from: global.connectAccount.publicAddress});

      setStatus('USDC Approved...');

      console.log(approval);

      setStatus('Waiting For Transaction Approval...');

      const transfer = await contract.methods
        .transfer(recipient, amount, '0')
        .encodeABI();

      const gasLimit = await EvmService.estimateGas(
        global.connectAccount.publicAddress,
        v1Address,
        '0x0',
        transfer,
      );

      const gasFeesResult = await EvmService.suggeseGasFee();

      const maxFeePerGas = gasFeesResult.high.maxFeePerGas;

      const maxFeePerGasHex =
        '0x' + BigNumber(maxFeePerGas * Math.pow(10, 9)).toString(16);

      const maxPriorityFeePerGas = gasFeesResult.high.maxPriorityFeePerGas;

      const maxPriorityFeePerGasHex =
        '0x' + BigNumber(maxPriorityFeePerGas * Math.pow(10, 9)).toString(16);

      const chainId = 137;
      console.log(chainId);

      console.log(gasLimit);

      const transferTx = {
        from: global.connectAccount.publicAddress,
        to: v1Address,
        data: transfer,
        gasLimit: gasLimit,
        value: '0x0',
        type: '0x2',
        chainId: '0x' + chainId.toString(16),
        maxPriorityFeePerGas: maxPriorityFeePerGasHex,
        maxFeePerGas: maxFeePerGasHex,
      };

      const json = JSON.stringify(transferTx);
      const serialized = '0x' + Buffer.from(json).toString('hex');

      const tx = await particleConnect.signAndSendTransaction(
        global.walletType,
        global.connectAccount.publicAddress,
        serialized,
      );

      if (tx.status) {
        return {
          status: true,
          fees: '0',
        };
      } else {
        return {
          status: false,
          fees: tx.data,
        };
      }
    } catch (e) {
      console.log(e);
      return {
        status: false,
        fees: e,
      };
    }
  }
}

export async function transferXUSD(
  smartAccount,
  provider,
  _amount,
  _recipient,
) {
  const usdcAddress = '0xA3C957f5119eF3304c69dBB61d878798B3F239D9';

  const decimals = 18;

  const amount = ethers.utils.parseUnits(_amount, decimals);

  const recipient = _recipient;

  web3 = this.createProvider();

  const tokenContract = new web3.eth.Contract(XUSDAbi, usdcAddress);

  const usdcAbi = new ethers.utils.Interface(XUSDAbi);

  const approveData = usdcAbi.encodeFunctionData('transfer', [
    recipient,
    amount,
  ]);

  const approve = {
    to: usdcAddress,
    data: approveData,
  };

  try {
    const txResponse = await smartAccount.sendTransaction({
      transaction: approve,
    });
    console.log('Response:', txResponse);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function transferUSDCV2(
  smartAccount,
  provider,
  _amount,
  _recipient,
  setStatus,
) {
  let txToSend;
  let totalGasUSDC;
  const contractAddress = '0x895510d75335db3c8b1463dd5ffc2d85994e1092';
  const usdcAddress = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';

  const decimals = 6;

  const amount = ethers.utils.parseUnits(_amount, decimals);

  const recipient = _recipient;

  web3 = this.createProvider();
  const approvalCall = web3.eth.abi.encodeFunctionCall(usdAbi[21], [
    contractAddress,
    amount,
  ]);

  const tx = {
    from: global.loginAccount.scw,
    to: usdcAddress,
    data: approvalCall,
  };
  console.log(tx);
  try {
    setStatus('Calculating Gas In USDC...');

    const gasNeeded = Number(await web3.eth.estimateGas(tx));
    const gasPrice = Number(await web3.eth.getGasPrice());
    const gas = 3 * gasNeeded * gasPrice;
    const fees = web3.utils.toWei(String(gas), 'wei') * 15;
    const totalGas = String(
      Number(web3.utils.toWei(String(gas), 'wei')) +
        Number(web3.utils.toWei(String((fees * 0.01).toFixed(0)), 'wei')),
    );
    totalGasUSDC = web3.utils.toWei(
      String(Number(web3.utils.fromWei(totalGas, 'ether')).toFixed(5)),
      'mwei',
    );
    console.log(Number(web3.utils.fromWei(totalGasUSDC, 'mwei')));
    const amountToApproveUSD = web3.utils.fromWei(
      String(
        Number(
          web3.utils.toWei(
            String(web3.utils.fromWei(String(amount), 'mwei')),
            'ether',
          ),
        ) +
          Number(
            web3.utils.toWei(
              String(web3.utils.fromWei(String(totalGasUSDC), 'mwei')),
              'ether',
            ),
          ),
        'ether',
      ),
    );

    const amountToApprove = web3.utils.toWei(
      Number(amountToApproveUSD).toFixed(6),
      'mwei',
    );

    console.log(
      'Total Transaction:',
      web3.utils.fromWei(amountToApprove, 'mwei'),
    );
    console.log('Total Gas USDC:', totalGasUSDC.toString());
    console.log('Amount To Approve:', amountToApprove);

    const usdcAbi = new ethers.utils.Interface(usdAbi);

    const approveData = usdcAbi.encodeFunctionData('transfer', [
      contractAddress,
      amountToApprove,
    ]);

    console.log(approveData);

    txToSend = {
      to: usdcAddress,
      data: approveData,
    };
  } catch (err) {
    console.error(err);
    return {status: false, fees: JSON.stringify(err)};
  }
  try {
    setStatus('Waiting For Transaction Approval...');

    const txResponse = await smartAccount.sendTransaction({
      transaction: txToSend,
    });
    console.log('Response:', txResponse);
    return {
      status: true,
      fees: String(Number(web3.utils.fromWei(totalGasUSDC, 'mwei')).toFixed(5)),
    };
  } catch (err) {
    console.error(err);
    return {status: false, fees: JSON.stringify(err)};
  }
}

export async function transferXUSDV2(
  smartAccount,
  provider,
  _amount,
  _recipient,
) {
  console.log('wait');
  const contractAddress = REMMITEX_TESTNET_CONTRACT;
  const usdcAddress = '0xA3C957f5119eF3304c69dBB61d878798B3F239D9';

  const decimals = 18;

  const amount = ethers.utils.parseUnits(_amount, decimals);

  const recipient = _recipient;

  web3 = this.createProvider();

  const usdcAbi = new ethers.utils.Interface(XUSDAbi);

  const approveData = usdcAbi.encodeFunctionData('transfer', [
    contractAddress,
    amount,
  ]);

  console.log(approveData);

  const txToSend = {
    to: usdcAddress,
    data: approveData,
  };

  try {
    const txResponse = await smartAccount.sendTransaction({
      transaction: txToSend,
    });
    console.log('Response:', txResponse);
    return {
      status: true,
      fees: '0',
    };
  } catch (err) {
    console.log(err);
    return {status: false, fees: '0'};
  }
}
