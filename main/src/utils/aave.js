import abi from '../abi/aave-v3-pool.json';
import { ethers } from 'ethers';
import createProvider from '../particle-auth';
import createConnectProvider from '../particle-connect';
import { AAVE_V3_LENDING_POOL_ADDRESS } from '@env';

export async function getAccountData(mainnet, authAddress){

    try{    
        const web3 = global.withAuth
            ? this.createProvider()
            : this.createConnectProvider();
        const contract = new web3.eth.Contract(abi, AAVE_V3_LENDING_POOL_ADDRESS);

        const result = await contract.methods.getUserAccountData(authAddress).call();
        const decimals = mainnet ? 8 : 18;
        const formattedResult = parseInt(result.totalCollateralBase) / 10 ** decimals;
        const balance = formattedResult.toFixed(3).toString();
    
        return balance;
    }catch(e){
        console.log(e);
    }

    return 0;
}
