import axios from 'axios'
import {RoundTwoPlaces} from './functions'


const fetchPrice = async () => {
    const price_res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-price`);
    return price_res.data['price'] ? price_res.data['price'] : 1;
  };
  
  const fetchUserPurchases = async (accountAddress: string) => {
    console.log("Fetching user purchases")
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-user-purchases/${accountAddress}`);
    return response.data
      .map((item: any, index: any) => ({
        ...item,
        originalIndex: index
      }))
      .filter((item: any) => item.amount !== "0")
      .map((item: any, index: any) => ({
        id: item.originalIndex,
        value: item.originalIndex,
        label1: `${RoundTwoPlaces(item.amount / (10 ** 8))} DEDA(at ${item.pricePerToken / (10 ** 18)}$ price)`,
        imageUrl1: '/logo.png',
        label2: `${item.USDTAmount / (10 ** 18)}`,
        purshase_price: item.pricePerToken,
        amount: item.amount,
        imageUrl2: '/TetherUSDT.svg'
      }));
  };

export {fetchPrice, fetchUserPurchases}