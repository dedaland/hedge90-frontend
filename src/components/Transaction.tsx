import { useState, useEffect, useReducer } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { type BaseError, useWriteContract, useSimulateContract, useReadContract, useAccount } from 'wagmi'
import Select, { StylesConfig, ThemeConfig, SingleValue } from 'react-select';
import { abi } from '../constants/erc20_abi'
import axios from 'axios'
import { contract_abi } from '../constants/contract_abi'
import { getAccount, readContract } from '@wagmi/core'
import { wagmiConfig as config } from '../wallet-connect';
import {LowBalanceTokenComponent, getBalance} from './token/lowBalanceToken';
import CancelTokensComponent from './token/cancelToken';
import BuyTokensComponent from './token/buyToken';
import SellTokensComponent from './token/sellToken';
import { RoundTwoPlaces } from '../utils/rounding';
import useStore from '../store/store'




const USDTAddress = process.env.REACT_APP_USDT_ADDRESS;
const tokenAddress = process.env.REACT_APP_TOKEN_ADDRESS;

// Address of the contract to spend the tokens
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const MAX_TO_APPROVE = 115792089237316195423570985008687907853269984665640564039457584007913129639935n


type OptionType = { label1: string; label2: string; value: string, imageUrl1: string, imageUrl2: string, purshase_price: number, amount: number };


const customStyles: StylesConfig<OptionType, false> = {
  container: (base, { isDisabled, isFocused }) => ({
    ...base,
    color: 'white',
    border: "#8a8aa0",
    width: "98%"
  }),
  control: (provided, state) => ({
    ...provided,
    boxShadow: "#8a8aa0",
    border: "1px solid #8a8aa0",
    backgroundColor: "#26262f",
    color: "white",
    width: "100%"
  }),
  menu: (provided) => ({
    ...provided,
    color: "white",
    backgroundColor: "#26262f",
    border: "1px solid #8a8aa0",
    padding: "2px"

  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#3a3a4f" : state.isFocused ? "#4a4a5f" : "#26262f",
    color: state.isSelected ? "white" : "white",
    borderBottom: "0.1px solid #8a8aa0",
    
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "white",
  }),
  input: (provided) => ({
    ...provided,
    color: "white",
    padding: "10px"

  }),
  placeholder: (provided) => ({
    ...provided,
    color: "white",
  }),
};

const customTheme: ThemeConfig = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: "#26262f",
    primary: 'white',
  },
});





// function ReadTokenBalanceContract({address, decimal, lowBalanceFunc, userInput}: 
//                                     {address: string, decimal: number, lowBalanceFunc:any, userInput: number}) {
//         const [balance, setBalance] = useState<bigint | null>(null);

//         useEffect(() => {
//           getBalance({address}).then((data)=>{
//             setBalance(data)
//           })
//       },[address])
        
    
//       if(balance && userInput){
//         console.log("HERER", balance, userInput)
//         if(balance < (userInput*(10**decimal))){
//           lowBalanceFunc(true)
//         }
//         else{
//           lowBalanceFunc(false)
//         }
//       }


//     // if (isLoading) {
//     //   return "Loading..."
//     // }

//     // if (isError) {
//     //   console.log("ERR", "Couldn't fetch balance", error)
//     //   return ""
//     // }
//     if(typeof balance === "bigint"){
//       // lowBalanceFunc((Number(balance)/(10**decimal)) < 50);
//       return (
//         <div style={{display:"inline"}}>
//           {(Number(balance)/(10**decimal)).toString()}
//          </div>
//       )
//     }else{
//       return "Couldn't fetch balance"
//     }
// }


  const fetchPrice = async () => {
    const price_res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-price`);
    return price_res.data['price'] ? price_res.data['price'] : 1;
  };
  
  const fetchUserPurchases = async (accountAddress: string) => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-user-purchases/${accountAddress}`);
    return response.data
      .map((item:any, index:any) => ({
        ...item,
        originalIndex: index
      }))
      .filter((item:any) => item.amount !== "0")
      .map((item:any, index:any) => ({
        id: item.originalIndex,
        value: item.originalIndex,
        label1: `${RoundTwoPlaces(item.amount / (10**8))} DEDA(at ${item.pricePerToken / (10**18)}$ price)`,
        imageUrl1: '/logo.png',
        label2: `${item.USDTAmount / (10**18)}`,
        purshase_price: item.pricePerToken,
        amount: item.amount,
        imageUrl2: '/TetherUSDT.svg' 
      }));
  };



function TransactionComponent(){//({ USDTAmountToBuy }: { USDTAmountToBuy: bigint }) {
    // const { address } = useAccount();
    const { setShowLowBalance, showLowBalance } = useStore()
    const [isUSDTApproved, setIsUSDTApproved] = useState(false);
    const [isUSDTApproveLoading, setisUSDTApproveLoading] = useState(false);
  
  
    const [isDeDaApproved, setIsDeDaApproved] = useState(false);
    const [isDeDaApproveLoading, setisDeDaApproveLoading] = useState(false);
    // 
    const [buysell, setBuysell] = useState('buy');
    const { isConnected, address } = useAccount();
  
  
  
    const [USDTAmountToBuy, setUSDTAmountToBuy] = useState(50);
    const [DeDaAmountToSell, setDeDaAmountToSell] = useState(0);
    const [DeDaIndexToSell, setDeDaIndexToSell] = useState(0);
    const [tokenPrice, setTokenPrice] = useState(0);
  
    
    const formatOptionLabel = ({ label1, imageUrl1, label2, imageUrl2 }: OptionType) => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={imageUrl1} alt="" style={{ marginRight: "10px", width: "20px", height: "20px" }} />
          <span>{label1}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>{label2}</span>
          <img src={imageUrl2} alt="" style={{ marginLeft: "10px", width: "20px", height: "20px" }} />
        </div>
      </div>
    );
  
  
  
    function toggleBuysell(input: string) {
      setBuysell(input);
    }
    // 
    const USDTAmountToBuyWithDecimal = USDTAmountToBuy * (10 ** 18)
    const DeDaAmountToSellWithDecimal = DeDaAmountToSell * (10 ** 8)
      // NOTE: fetch price first
    // const tokenPrice = 1
    const [finalPriceWithDecimal, setFinalPriceWithDecimal] = useState(0) // USDTAmountToBuy / BigInt(tokenPrice * (10**18)));
    // setFinalPriceWithDecimal(USDTAmountToBuy / BigInt(tokenPrice * (10**18)))
    // let  = USDTAmountToBuy / BigInt(tokenPrice * (10**18))
  
    // Read the allowance to check if the amount is already approved
    const { data: usdtAllowance } = useReadContract({
      address: USDTAddress as `0x${string}`,
      abi: abi,
      functionName: 'allowance',
      args: [address ?? '0x0000000000000000000000000000000000000000', contractAddress as `0x${string}`],
    });
    
    const { data: dedaAllowance } = useReadContract({
      address: tokenAddress as `0x${string}`,
      abi: abi,
      functionName: 'allowance',
      args: [address ?? '0x0000000000000000000000000000000000000000', contractAddress as `0x${string}`],
    });
  
    
    useEffect(() => {
      // console.log("APPROVE DATA", usdtAllowance, USDTAmountToBuyWithDecimal)
      if (usdtAllowance && usdtAllowance >= USDTAmountToBuyWithDecimal) {
        setIsUSDTApproved(true);
      } else {
        setIsUSDTApproved(false);
      }
    }, [usdtAllowance, USDTAmountToBuy, finalPriceWithDecimal, USDTAmountToBuyWithDecimal]);
  
  
    
  
    // Prepare the write contract for the approve function
    const { data: buyData, error: buyErr } = useSimulateContract({
      address: USDTAddress as `0x${string}`,
      abi: abi,
      functionName: 'approve',
      args: [contractAddress as `0x${string}`, MAX_TO_APPROVE],
    });
  
    const { writeContract: writeUSDTApproveContract } = useWriteContract()
  
    useEffect(() => {
      if (buyErr) {
        console.error("Failed to simulate contract approval.", buyErr);
      }
    }, [buyErr]);
  
    const handleBuyApprove = () => {
      let amountToUse = USDTAmountToBuy;
      if (amountToUse < 50n) {
        alert("Minimum USDT is 50!")
      }
      if (!buyData || !buyData.request) {
        console.error("Approval simulation data is not available.", buyErr);
        return;
        
      }
      setisUSDTApproveLoading(true)
      writeUSDTApproveContract(
        buyData.request,{
              onSuccess: () => {
                setTimeout(() => {
                  setIsUSDTApproved(true)
                  setisUSDTApproveLoading(false);
                }, 15000)
            },
            onError: () => {
              setisUSDTApproveLoading(false);
            }
          }
      )
    }
  
    useEffect(() => {
      if (dedaAllowance && dedaAllowance >= DeDaAmountToSellWithDecimal) {
        setIsDeDaApproved(true);
      } else {
        setIsDeDaApproved(false);
      }
    }, [dedaAllowance, DeDaAmountToSell, DeDaAmountToSellWithDecimal]);
  
    const { data: sellData, error: sellErr } = useSimulateContract({
      address: tokenAddress as `0x${string}`,
      abi: abi,
      functionName: 'approve',
      args: [contractAddress as `0x${string}`, MAX_TO_APPROVE],
    });

    useEffect(() => {
      if (sellErr) {
        console.error("Failed to simulate contract sell.", sellErr);
      }
    }, [sellErr]);
  
    const { writeContract: writeDeDaApproveContract } = useWriteContract()
  
    const handleSellApprove = () => {
      if (!sellData || !sellData.request) {
        console.error("Approval simulation data is not available.");
        return;
        
      }
      setisDeDaApproveLoading(true)
      writeDeDaApproveContract(
        sellData.request,{
              onSuccess: () => {
                setTimeout(() => {
                  setIsDeDaApproved(true)
                  setisDeDaApproveLoading(false);
                }, 15000)
            },
            onError: () => {
              setisDeDaApproveLoading(false);
            }
          }
      )
    }
  
    const handleSelectChange = (selectedOption: SingleValue<OptionType>) => {
      if(selectedOption){
        setDeDaIndexToSell(Number(selectedOption.value));
      }
    };
  
  
    // const [selectOptions, setSelectOptions] = useState<OptionType[]>([]);
    // const [loadingOptions, setLoadingOptions] = useState(true);
    
    
      // const [tokenPrice, setTokenPrice] = useState(1);
      // const [finalPriceWithDecimal, setFinalPriceWithDecimal] = useState(0);
      const [selectOptions, setSelectOptions] = useState<OptionType[]>([]);
      const [loadingOptions, setLoadingOptions] = useState(false);
    
      const account = getAccount(config);
    
  const queryClient = useQueryClient();

  const { data: priceData, error: priceError } = useQuery({
    queryKey: ['price'],
    queryFn: fetchPrice,
    refetchInterval: 5000,
  });

  const { data: userPurchasesData, error: userPurchasesError } = useQuery({
    queryKey: ['userPurchases', account.address],
    queryFn: () => fetchUserPurchases(account.address?account.address:""),
    refetchInterval: 5000,
    enabled: !!account.address // only run this query if account.address is available
  });
    
  useEffect(() => {
    if (priceData) {
      setTokenPrice(priceData);
      setFinalPriceWithDecimal(RoundTwoPlaces(Number(USDTAmountToBuy) / priceData - (USDTAmountToBuy / priceData * 0.04)));
    }
  }, [priceData, USDTAmountToBuy]);

  useEffect(() => {
    if (userPurchasesData) {
      setSelectOptions(userPurchasesData);
      setLoadingOptions(false);
    }
  }, [userPurchasesData]);

  useEffect(() => {
    if (priceError) {
      console.log("NO PRICE");
    }
    if (userPurchasesError) {
      console.log("NO USER PURCHASES");
      setLoadingOptions(false);
    }
  }, [priceError, userPurchasesError]);
      // const [tokenBalanceLow, setTokenBalanceLow] = useState(false);
  
    return (
      <div>
        {/*  */}
        <section className="transactions">
                    <div className="transaction-panel">
                        <div className="panel-header">
                            <button 
                            onClick={() => toggleBuysell('buy')}
                            style={buysell === 'buy' ? {backgroundColor: "white", color: "black"} : {backgroundColor: "#26262f", color: "white"}} className="buy-button">Buy</button>
                            <button 
                            onClick={() => toggleBuysell('sell')}
                            style={buysell === 'sell' ? {backgroundColor: "white", color: "black"} : {backgroundColor: "#26262f", color: "white"}} className="refund-button">Sell</button>
                                                        <button 
                            onClick={() => toggleBuysell('cancel')}
                            style={buysell === 'cancel' ? {backgroundColor: "white", color: "black"} : {backgroundColor: "#26262f", color: "white"}} className="refund-button">Cancel</button>
                        </div>
                        {/* buy section */}
  
                        <div style={buysell === 'buy' ? {display: 'block'} : {display: 'none'}} className="sell-buy-section">
                            <h5>Tether to pay</h5>
                            {/* <div style={{color: "red", display: tokenBalanceLow?"block":"none"}}>your USDT balance is too low!</div> */}
                            <input type="text"
                            value={USDTAmountToBuy === 0 ? "" : USDTAmountToBuy.toString()}
                            onChange={(e) => {
                              let value = Number(e.target.value);
                              let finalPrice = RoundTwoPlaces((value / tokenPrice)  - (value / tokenPrice * 0.04))
                              console.log("finalPrice", finalPrice);
                              setUSDTAmountToBuy(value);
                              setFinalPriceWithDecimal(finalPrice);
                              
                          }}
                          onBlur={(e) => {
                              let value = Number(e.target.value);
                              if (value < 50) {
                                  setUSDTAmountToBuy(50);
                              }
                          }}
                             placeholder="Amount" />
                            <h5>DedaCoin you recieve</h5>
                            <input type="string"
                                    value={finalPriceWithDecimal == 0 ? "":RoundTwoPlaces(finalPriceWithDecimal).toString()}
                                    placeholder="Amount" disabled/>
                            
                            <div className='available-amount'>
                              Available: 
                              {/* {isConnected?<ReadTokenBalanceContract address={USDTAddress as `0x${string}`} decimal={18}  userInput={USDTAmountToBuy} lowBalanceFunc={(state: boolean)=>{setTokenBalanceLow(state)}}/>:"Connect your wallet"} */}
                            </div>
                            {/* <div>{isConnected? <LowBalanceTokenComponent showLowBalance={tokenBalanceLow} lowBalanceFunc={(state: boolean)=>{setTokenBalanceLow(state)}} name={"USDT"} address={USDTAddress as `0x${string}`} userInput={USDTAmountToBuy}  decimal={18}/>:""}</div> */}
                            <br />
                            <br />
                            <input type="string" placeholder='inviter code' />
                            <p className='price-text'>&#9432; 1 DedaCoin = {tokenPrice !== 0? tokenPrice.toString() + ` Tether` : `Loading...`}</p>
                            <div style={{textAlign: "center", fontSize:"0.7em", paddingBottom:"10px"}}>The minimum purchase amount is set at 50 USDT.</div>
                            {isUSDTApproved ? (
                              <BuyTokensComponent/>
                              ) : (
                                <button disabled={isUSDTApproveLoading} className="sell-button" onClick={handleBuyApprove}>{ isUSDTApproveLoading ? "Processing..." : "Approve USDT"}</button>
                              )}

                            
                        </div>
                        {/* sell section */}
                        <div style={buysell === 'sell' ? {display: 'block'} : {display: 'none'}} className="sell-buy-section">
                        <div className="previous-purchases">
                            <h3> <img width="15px" src="/time-past-svgrepo-com.svg" alt="" /> Previous Purchases</h3>
                            <Select
                              isLoading={loadingOptions}
                              options={selectOptions}
                              styles={customStyles}
                              theme={customTheme}
                              formatOptionLabel={formatOptionLabel}
                              value={selectOptions.find(option => option.value === DeDaIndexToSell.toString())}
                              onChange={handleSelectChange}
                            />
  
                        </div>
                            <h5>DedaCoin to pay</h5>
                            <input type="number"
                                    value={DeDaAmountToSell === 0 ? "" : DeDaAmountToSell.toString()}
                                    onChange={
                                      (e) => {
                                        const data = selectOptions.reduce((acc, option) => option.value == DeDaIndexToSell.toString() ? acc + (option.amount/10**8)! : acc, 0)
                                        if(data >= Number(e.target.value)){
                                          setDeDaAmountToSell(Number(e.target.value))
                                        }
                                        else{
                                          setDeDaAmountToSell(0)
                                        }
                                      }
                                    }
                                    // max={selectOptions.reduce((acc, option) => option.value == DeDaIndexToSell.toString() ? acc + (option.amount/10**8)! : acc, 0)}
                                    placeholder="Amount" />
                            <button className='max-button'
                            onClick={() => {
                              const data = selectOptions.reduce((acc, option) => option.value == DeDaIndexToSell.toString() ? acc + (option.amount/10**8)! : acc, 0)
                              setDeDaAmountToSell(data)
                            }}
                            >Max</button>
                            <div className='available-amount'>
                              Available: 
                              {/* {isConnected?<ReadTokenBalanceContract address={tokenAddress as `0x${string}`} decimal={8}  userInput={DeDaAmountToSell} lowBalanceFunc={(state: boolean)=>{setTokenBalanceLow(state)}}/>:"Connect your wallet"} */}

                              </div>
                            {/* <div>{isConnected? <LowBalanceTokenComponent showLowBalance={tokenBalanceLow} lowBalanceFunc={(state: boolean)=>{setTokenBalanceLow(state)}} name={"DedaCoin"} address={tokenAddress as `0x${string}`} userInput={DeDaAmountToSell}  decimal={8}/>:""}</div> */}
                            <h5>Tether you receive</h5>
                            <input type="text"
                            value={DeDaAmountToSell === 0 ? "" : (Number(DeDaAmountToSell) * selectOptions.reduce((acc, option) => option.value == DeDaIndexToSell.toString() ? acc + (option.purshase_price/(10**18) - (option.purshase_price/(10**18)*0.1) - (option.purshase_price/(10**18)*0.04))! : acc, 0)).toString()}
                            // value={DeDaAmountToSell == 0n ? "" : (Number(DeDaAmountToSell) * selectOptions.map((option) => option.value == DeDaIndexToSell.toString() ? option.usdt_max : 0)).toString()}
                            placeholder="Amount" disabled />
                            <p className='price-text'>&#9432; 1 DedaCoin = {tokenPrice? tokenPrice.toString() + ` Tether` : `Loading...`}</p>
                            {isDeDaApproved ? (
                              <SellTokensComponent />
                              ) : (
                                <button disabled={isDeDaApproveLoading} className="sell-button" onClick={handleSellApprove}>{ isDeDaApproveLoading ? "Processing..." : "Approve Dedacoin"}</button>
                              )}
                            {/* <button className="sell-button">Sell Now</button> */}
                        </div>
                        {/* cancel section */}
                        <div style={buysell === 'cancel' ? {display: 'block'} : {display: 'none'}} className="sell-buy-section">
                        <div className="previous-purchases">
                            <h3> <img width="15px" src="/time-past-svgrepo-com.svg" alt="" /> Previous Purchases</h3>
                            <Select
                              isLoading={loadingOptions}
                              options={selectOptions}
                              styles={customStyles}
                              theme={customTheme}
                              formatOptionLabel={formatOptionLabel}
                              value={selectOptions.find(option => option.value === DeDaIndexToSell.toString())}
                              onChange={handleSelectChange}
                            />
  
                        </div>
                            <hr style={{borderBottom:"none", width:"95%"}} />
                            <p className='price-text'>&#9432; 1 DedaCoin = {tokenPrice? tokenPrice.toString() + ` Tether` : `Loading...`}</p>
                            {/* {isDeDaApproved ? (
                              ) : (
                                <button disabled={isDeDaApproveLoading} className="sell-button" onClick={handleSellApprove}>{ isDeDaApproveLoading ? "Processing..." : "Approve USDT"}</button>
                              )} */}
                              <CancelTokensComponent />

                        </div>

                    </div>
                </section>
        {/*  */}
        
      </div>
    );
  }

export default TransactionComponent;
