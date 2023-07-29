import CryptoJS from 'react-native-crypto-js'
import axios from 'axios'
async function getQuotes(amount) {
  try {
    let body = {
      coinId: 116,
      chainId: 3,
      fiatAmount: amount,
      fiatType: 1,
      type: 1
    }
    let payload = {
      timestamp: new Date().getTime(),
      body
    }
    let apiKey = '', apiSecret = 'HeKmuJx30AaMaiB4O2hnuL1teJc1E4sv';
    payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    let signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(payload, apiSecret));
    let options = {
      url: 'https://api.onramp.money/onramp/api/v2/common/transaction/quotes',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'X-ONRAMP-SIGNATURE': signature,
        'X-ONRAMP-APIKEY': apiKey,
        'X-ONRAMP-PAYLOAD': payload
      },
      data: body
    };
    let data = await axios(options)
    console.log(data?.data);
  } catch (error) {
    console.log(error?.response?.data)
  }
}

export { getQuotes }