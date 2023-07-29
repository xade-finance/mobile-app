import {AbiEncodeFunction, EVMReqBodyMethod} from './NetParams';
import JsonRpcRequest from './NetService';
import BigNumber from 'bignumber.js';
import {Buffer} from 'buffer';
import * as ParticleAuth from 'react-native-particle-auth';
import * as ParticleConnect from 'react-native-particle-connect';

export class EvmService {
  static async rpc(method, params) {
    const rpcUrl = 'https://rpc.particle.network/';
    const path = 'evm-chain';
    let chainInfo;
    if (global.withAuth) {
      chainInfo = await ParticleAuth.getChainInfo();
    } else {
      chainInfo = await ParticleConnect.getChainInfo();
    }
    const chainId = chainInfo.chain_id;
    const result = await JsonRpcRequest(rpcUrl, path, method, params, chainId);
    return result;
  }

  static async getPrice(addresses, currencies) {
    return await this.rpc(EVMReqBodyMethod.particleGetPrice, [
      addresses,
      currencies,
    ]);
  }

  static async getTokensAndNFTs(address) {
    return await this.rpc(EVMReqBodyMethod.particleGetTokensAndNFTs, [address]);
  }

  static async getTransactionsByAddress(address) {
    return await this.rpc(EVMReqBodyMethod.particleGetTransactionsByAddress, [
      address,
    ]);
  }

  static async suggeseGasFee() {
    return await this.rpc(EVMReqBodyMethod.particleSuggestedGasFees, []);
  }

  static async estimateGas(from, to, value, data) {
    const obj = {from: from, to: to, value: value, data: data};
    return await this.rpc(EVMReqBodyMethod.ethEstimateGas, [obj]);
  }

  static async erc20Transfer(contractAddress, to, amount) {
    return await this.rpc(EVMReqBodyMethod.particleAbiEncodeFunctionCall, [
      contractAddress,
      AbiEncodeFunction.erc20Transfer,
      [to, amount],
    ]);
  }

  static async erc20Approve(contractAddress, spender, amount) {
    return await this.rpc(EVMReqBodyMethod.particleAbiEncodeFunctionCall, [
      contractAddress,
      AbiEncodeFunction.erc20Approve,
      [spender, amount],
    ]);
  }

  static async erc20TransferFrom(contractAddress, from, to, amount) {
    return await this.rpc(EVMReqBodyMethod.particleAbiEncodeFunctionCall, [
      contractAddress,
      AbiEncodeFunction.erc20TransferFrom,
      [from, to, amount],
    ]);
  }

  static async erc721SafeTransferFrom(contractAddress, from, to, tokenId) {
    return await this.rpc(EVMReqBodyMethod.particleAbiEncodeFunctionCall, [
      contractAddress,
      AbiEncodeFunction.erc721SafeTransferFrom,
      [from, to, tokenId],
    ]);
  }

  static async erc1155SafeTransferFrom(
    contractAddress,
    from,
    to,
    id,
    amount,
    data,
  ) {
    const params = [from, to, id, amount, data].filter(function (element) {
      return element !== undefined;
    });
    return await this.rpc(EVMReqBodyMethod.particleAbiEncodeFunctionCall, [
      contractAddress,
      AbiEncodeFunction.erc1155SafeTransferFrom,
      params,
    ]);
  }

  static async abiEncodeFunctionCall(
    contractAddress,
    methodName,
    params,
    abiJsonString,
  ) {
    return await this.rpc(EVMReqBodyMethod.particleAbiEncodeFunctionCall, [
      contractAddress,
      methodName,
      params,
      abiJsonString,
    ]);
  }

  static async getTokenByTokenAddress(address, tokenAddresses) {
    return await this.rpc(EVMReqBodyMethod.particleGetTokensByTokenAddresses, [
      address,
      tokenAddresses,
    ]);
  }

  static async readContract(
    contractAddress,
    methodName,
    params,
    abiJsonString,
  ) {
    const data = await this.abiEncodeFunctionCall(
      contractAddress,
      methodName,
      params,
      abiJsonString,
    );
    const callParams = {data: data, to: contractAddress};
    const result = this.rpc('eth_call', [callParams, 'latest']);
    return result;
  }

  static async writeContract(
    from,
    contractAddress,
    methodName,
    params,
    abiJsonString,
  ) {
    const data = await this.abiEncodeFunctionCall(
      contractAddress,
      methodName,
      params,
      abiJsonString,
    );

    const gasLimit = await this.estimateGas(from, contractAddress, '0x0', data);
    const gasFeesResult = await this.suggeseGasFee();

    const maxFeePerGas = gasFeesResult.high.maxFeePerGas;
    const maxFeePerGasHex =
      '0x' + BigNumber(maxFeePerGas * Math.pow(10, 9)).toString(16);

    const maxPriorityFeePerGas = gasFeesResult.high.maxPriorityFeePerGas;
    const maxPriorityFeePerGasHex =
      '0x' + BigNumber(maxPriorityFeePerGas * Math.pow(10, 9)).toString(16);
    const chainInfo = await ParticleAuth.getChainInfo();
    const chainId = chainInfo.chain_id;

    const transaction = {
      from: from,
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
