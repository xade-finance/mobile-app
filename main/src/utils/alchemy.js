import { Alchemy, Network } from "alchemy-sdk";
import { ALCHEMY_API_KEY_PROD, ALCHEMY_API_KEY_TEST } from '@env';
import coins, { COINS } from "../data/local/coins";

export async function getTokenBalance(mainnet, authAddress, tokens){
    data = [];

    try{
        const config = {
            apiKey: mainnet ? ALCHEMY_API_KEY_PROD : ALCHEMY_API_KEY_TEST,
            network: mainnet ? Network.MATIC_MAINNET : Network.MATIC_MUMBAI,
        };

        const alchemy = new Alchemy(config);

        //Feel free to switch this wallet address with another address
        const ownerAddress = authAddress;

        const tokenContractAddresses = tokens;

        data = await alchemy.core.getTokenBalances(
            ownerAddress,
            tokenContractAddresses
        );

        // console.log("Token balance for Address");
        // console.log(data);

    }catch (err) {
        console.error(err);
    }
    return data;
}

export async function getUserInvestmentPortfolio(mainnet, authAddress){
    let data = [];
    try{
        const config = {
            apiKey: mainnet ? ALCHEMY_API_KEY_PROD : ALCHEMY_API_KEY_TEST,
            network: mainnet ? Network.MATIC_MAINNET : Network.MATIC_MUMBAI,
        };

        const alchemy = new Alchemy(config);

        //Feel free to switch this wallet address with another address
        const ownerAddress = authAddress;

        const balances = await alchemy.core.getTokenBalances(ownerAddress);

        // Remove tokens with zero balance
        const nonZeroBalances = balances.tokenBalances.filter((token) => {
            return parseInt(token.tokenBalance, 16) !== 0;
        });

            console.log(ownerAddress);
        // Counter for SNo of final output
        let i = 1;
        // Loop through all tokens with non-zero balance
        for (let token of nonZeroBalances) {
            // Get balance of token
            let balance = parseInt(token.tokenBalance, 16);

            // Get metadata of token
            const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);

            // Compute token balance in human-readable format
            balance = balance / Math.pow(10, metadata.decimals);
            balance = balance.toFixed(2);

            // Print name, balance, and symbol of token
            // console.log(`${i++}. ${metadata.name}: ${balance} ${metadata.symbol}`);

            try{
                console.log(token);
                const id = metadata.name.toLowerCase().replaceAll(' ','-');
                const element = COINS.find(x => (x.id === id || x.symbol.toLowerCase() === metadata.symbol.toLowerCase()));

                const element_id = element.id;

                const url = `https://api.coingecko.com/api/v3/coins/${element_id}`;
                const data1 = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                let coinDetails = await data1.json()

                metadata.market = coinDetails;

                if (metadata.symbol.length < 15 && metadata.market !== undefined && metadata.market !== null){
                    data.push({
                        'balance': balance,
                        'name': metadata.name,
                        'symbol': metadata.symbol,
                        'image' : metadata.logo ? metadata.logo : metadata.market.image.large,
                        'market' : metadata.market,
                        'current_price' : metadata.market.market_data.current_price.usd,
                        'price_change_percentage_24h' : metadata.market.market_data.price_change_percentage_24h,
                    })
                }
    

            }catch(e){
                console.log(e);
            }

           
        }

    }catch (err) {
        console.error(err);
    }
    return data;
}



export async function getUserCollectiblePortfolio(mainnet, authAddress){
    data = [];
    try{
        const config = {
            apiKey: mainnet ? ALCHEMY_API_KEY_PROD : ALCHEMY_API_KEY_TEST,
            network: mainnet ? Network.MATIC_MAINNET : Network.MATIC_MUMBAI,
        };

        const alchemy = new Alchemy(config);

        //Feel free to switch this wallet address with another address
        const ownerAddress = authAddress;

        const result = await alchemy.nft.getNftsForOwner(ownerAddress);

        data = result.ownedNfts;

        console.log(data);
        
    }catch (err) {
        console.error(err);
    }
    return data;
}