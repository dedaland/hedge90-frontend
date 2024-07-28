import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { type BaseError, useWriteContract, useSimulateContract, useReadContract, useAccount } from 'wagmi'
import Select, { StylesConfig, ThemeConfig, SingleValue } from 'react-select';
import { abi } from '../erc20_abi'
import axios from 'axios'
import { contract_abi } from '../contract_abi'
import { getAccount, readContract } from '@wagmi/core'
import { wagmiConfig as config } from '../wallet-connect';
import InvoiceModal from './savableTnx'
import { create } from 'zustand';


interface State {
  tokenPrice: number;
  setTokenPrice: (price: number) => void;
  USDTAmountToBuy: number;
  setUSDTAmountToBuy: (amount: number) => void;
  finalPriceWithDecimal: number;
  setFinalPriceWithDecimal: (price: number) => void;
  isUSDTApproved: boolean;
  setIsUSDTApproved: (approved: boolean) => void;
  isUSDTApproveLoading: boolean;
  setIsUSDTApproveLoading: (loading: boolean) => void;
  DeDaAmountToSell: number;
  setDeDaAmountToSell: (amount: number) => void;
  DeDaIndexToSell: number;
  setDeDaIndexToSell: (index: number) => void;
  isDeDaApproved: boolean;
  setIsDeDaApproved: (approved: boolean) => void;
  isDeDaApproveLoading: boolean;
  setIsDeDaApproveLoading: (loading: boolean) => void;
  selectOptions: any[];
  setSelectOptions: (options: any[]) => void;
  loadingOptions: boolean;
  setLoadingOptions: (loading: boolean) => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  handleBuyApprove: () => void;
  handleSellApprove: () => void;
  showLowBalance: boolean;
  setShowLowBalance: (show: boolean) => void;
}

const useStore = create<State>((set) => ({
  tokenPrice: 0,
  setTokenPrice: (price) => set({ tokenPrice: price }),
  USDTAmountToBuy: 50,
  setUSDTAmountToBuy: (amount) => set({ USDTAmountToBuy: amount }),
  finalPriceWithDecimal: 0,
  setFinalPriceWithDecimal: (price) => set({ finalPriceWithDecimal: price }),
  isUSDTApproved: false,
  setIsUSDTApproved: (approved) => set({ isUSDTApproved: approved }),
  isUSDTApproveLoading: false,
  setIsUSDTApproveLoading: (loading) => set({ isUSDTApproveLoading: loading }),
  DeDaAmountToSell: 0,
  setDeDaAmountToSell: (amount) => set({ DeDaAmountToSell: amount }),
  DeDaIndexToSell: 0,
  setDeDaIndexToSell: (index) => set({ DeDaIndexToSell: index }),
  isDeDaApproved: false,
  setIsDeDaApproved: (approved) => set({ isDeDaApproved: approved }),
  isDeDaApproveLoading: false,
  setIsDeDaApproveLoading: (loading) => set({ isDeDaApproveLoading: loading }),
  selectOptions: [],
  setSelectOptions: (options) => set({ selectOptions: options }),
  loadingOptions: true,
  setLoadingOptions: (loading) => set({ loadingOptions: loading }),
  isConnected: false,
  setIsConnected: (connected) => set({ isConnected: connected }),
  handleBuyApprove: () => set({ isUSDTApproveLoading: true }),
  handleSellApprove: () => set({ isDeDaApproveLoading: true }),
  showLowBalance: false,
  setShowLowBalance: (show) => set({ showLowBalance: show })
}));


const fetchPrice = async () => {
  const price_res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-price`);
  return price_res.data['price'] ? price_res.data['price'] : 1;
};

const fetchUserPurchases = async (accountAddress: string) => {
  console.log("Fetching user purchases")
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

function RoundTwoPlaces(num: any){
  return Math.floor(num * 100) / 100;
}

function getBalance({address}: {address: string}){
  const account = getAccount(config)
  // console.log("getBalance", account)
  const result = readContract(config, {
    abi: abi,
    address: address as `0x${string}`,
    functionName: 'balanceOf',
    args: [account.address ?? '0x0000000000000000000000000000000000000000'],
  })
  return result.then((data) => {
      console.log("DATA1", data)
      return data
    }).catch((err)=>{
      console.log("ERR", err)
      return null;
    })
}


function ReadUSDTBalanceContract({address, decimal}: {address: string, decimal: number}) {
        const [balance, setBalance] = useState<bigint | null>(null);
        const { USDTAmountToBuy, setShowLowBalance, showLowBalance, DeDaAmountToSell } = useStore();
        let showLowBalanceLocal = false
        useEffect(() => {
          getBalance({address}).then((data)=>{
            setBalance(data)
              if(data && data < (USDTAmountToBuy*(10**decimal))){
                setShowLowBalance(true)
                showLowBalanceLocal = true
              console.log("HERE IN USDT looooooow1", showLowBalance)
              }
              else{
                setShowLowBalance(false)
              console.log("HERE IN USDT looooooow2", showLowBalance)

              }
          })
      },[address, USDTAmountToBuy])
    if(typeof balance === "bigint"){
      return (
        <div style={{display:"inline"}}>
          <div style={{display:"inline"}}>
            {(Number(balance)/(10**decimal)).toString()}
          </div>
          <div style={{display: showLowBalance?"block":"none"}}>
            <hr style={{borderBottom: "none",  borderColor: "gray"}} />
            <div style={{color: "red", textAlign:"right", fontSize:"0.8em"}}>not enough USDT</div>
          </div>
        </div>
      )
    }else{
      return "Couldn't fetch balance"
    }
}

function ReadDeDaBalanceContract({address, decimal}: {address: string, decimal: number}) {
  const [balance, setBalance] = useState<bigint | null>(null);
  const { setShowLowBalance, showLowBalance, DeDaAmountToSell } = useStore();
  let showLowBalanceLocal = false
  useEffect(() => {
    getBalance({address}).then((data)=>{
      setBalance(data)
        if(data && data < (DeDaAmountToSell*(10**decimal))){
          setShowLowBalance(true)
          showLowBalanceLocal = true
        }
        else{
          setShowLowBalance(false)

        }
    })
},[address, DeDaAmountToSell])
if(typeof balance === "bigint"){
return (
  <div style={{display:"inline"}}>
    <div style={{display:"inline"}}>
      {(Number(balance)/(10**decimal)).toString()}
    </div>
    <div style={{display: showLowBalance?"block":"none"}}>
      <hr style={{borderBottom: "none",  borderColor: "gray"}} />
      <div style={{color: "red", textAlign:"right", fontSize:"0.8em"}}>not enough DedaCoin</div>
    </div>
  </div>
)
}else{
return "Couldn't fetch balance"
}
}

function BuyTokensComponent() {
    const [isLoading, setisLoading] = useState(false);
    const [isPurchased, setisPurchased] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tnxHash, setTnxHash] = useState("0x");
    const {USDTAmountToBuy, finalPriceWithDecimal} = useStore(); // RoundTwoPlaces
    // console.log("BUY AMOUNT", amountToBuy, amount)
  
    const { data, error } = useSimulateContract({
      address: contractAddress as `0x${string}`,
      abi: contract_abi,
      functionName: 'buyTokens',
      args: [BigInt(USDTAmountToBuy * (10 ** 18)), "0x0000000000000000000000000000000000000000"],
    });
    console.log("Buy Err", error?.message)
  
    const { writeContract } = useWriteContract()
  
    return (
      <div>
          <InvoiceModal isOpen={isModalOpen} amount={(Number(RoundTwoPlaces(finalPriceWithDecimal)))} tnxId={tnxHash} action='purchase' onClose={() => setIsModalOpen(false)} />
        {isPurchased ? (
        <button className="sell-button">Successfully purchased</button>
       ) :
        (<button disabled={isLoading} className="sell-button" onClick={() => {
          setisLoading(true)
          writeContract(
            data!.request,{
              onSuccess: (data) => {
                console.log("USDT APPROVE DATA", data)
  
                setTimeout(() => {
                  setisPurchased(true)
                  setisLoading(false);
                  setTnxHash(data)
                  setIsModalOpen(true)
                }, 15000)
              
            },
            onError: (error) => {
              console.log("ERROR", error)
              setisLoading(false);
            }
          }
      )
    }
    }>
          { isLoading ? "Processing..." : "Buy DedaCoin"}
        </button>)}
      </div>
    );
  }
  
  
  function SellTokensComponent() {
    const [isLoading, setisLoading] = useState(false);
    const [isPurchased, setisPurchased] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tnxHash, setTnxHash] = useState("0x");
    const { DeDaIndexToSell, DeDaAmountToSell } = useStore()
  
    const { data, error } = useSimulateContract({
      address: contractAddress as `0x${string}`,
      abi: contract_abi,
      functionName: 'returnTokens',
      args: [BigInt(DeDaAmountToSell * (10**8)), BigInt(DeDaIndexToSell)],
    });
    console.log("Sell Err", error?.message)
  
    const { writeContract } = useWriteContract()
  
    return (
      <div>
        <InvoiceModal isOpen={isModalOpen} amount={Number(DeDaAmountToSell)} tnxId={tnxHash} action='return' onClose={() => setIsModalOpen(false)} />
        {isPurchased ? (
        <button className="sell-button">Successfully returned</button>
       ) :
        (<button disabled={isLoading} className="sell-button" onClick={() => {
          setisLoading(true)
          writeContract(
            data!.request,{
              onSuccess: (data) => {
                setTimeout(() => {
                  setisPurchased(true)
                  setisLoading(false);
                  setTnxHash(data)
                  setIsModalOpen(true)
                }, 15000)
              
            },
            onError: () => {
              setisLoading(false);
            }
          }
      )
    }
    }>
          { isLoading ? "Processing..." : "Sell DedaCoin"}
        </button>)}
      </div>
    );
  }

  function CancelTokensComponent() {
    const [isLoading, setisLoading] = useState(false);
    const [isPurchased, setisPurchased] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tnxHash, setTnxHash] = useState("0x");
    const { DeDaIndexToSell } = useStore()
  
    const { data, error } = useSimulateContract({
      address: contractAddress as `0x${string}`,
      abi: contract_abi,
      functionName: 'cancelHedge90',
      args: [BigInt(DeDaIndexToSell)],
    });
    console.log("Cancel Err", error?.message)
  
    const { writeContract } = useWriteContract()
  
    return (
      <div>
        <InvoiceModal isOpen={isModalOpen} amount={(Number(0)/10**8)} tnxId={tnxHash} action='return' onClose={() => setIsModalOpen(false)} />
        {isPurchased ? (
        <button className="sell-button">Successfully canceled</button>
       ) :
        (<button disabled={isLoading} className="sell-button" onClick={() => {
          setisLoading(true)
          writeContract(
            data!.request,{
              onSuccess: (data) => {
                setTimeout(() => {
                  setisPurchased(true)
                  setisLoading(false);
                  setTnxHash(data)
                  setIsModalOpen(true)
                }, 15000)
              
            },
            onError: () => {
              setisLoading(false);
            }
          }
      )
    }
    }>
          { isLoading ? "Processing..." : "Cancel Hedge90"}
        </button>)}
      </div>
    );
  }



function TransactionComponent(){
    const { isUSDTApproved, setIsUSDTApproved } = useStore();
    const { isUSDTApproveLoading, setIsUSDTApproveLoading } = useStore();
  
  
    const { isDeDaApproved, setIsDeDaApproved } = useStore();
    const { isDeDaApproveLoading, setIsDeDaApproveLoading } = useStore();
    // 
    const [buysell, setBuysell] = useState('buy');
    const { isConnected, address } = useAccount();
  
  
  
    const {USDTAmountToBuy, setUSDTAmountToBuy} = useStore();
    const {DeDaAmountToSell, setDeDaAmountToSell} = useStore();
    const { DeDaIndexToSell, setDeDaIndexToSell } = useStore()
    const  { tokenPrice, setTokenPrice } = useStore();
  
    
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
    const {finalPriceWithDecimal, setFinalPriceWithDecimal} = useStore()
  
    // Read the allowance to check if the amount is already approved
    const { data: usdtAllowance } = useReadContract({
      address: USDTAddress as `0x${string}`,
      abi: abi,
      functionName: 'allowance',
      args: [address ?? '0x0000000000000000000000000000000000000000', contractAddress as `0x${string}`],
    });

    function checkUSDTApproval(value: number){
      if (usdtAllowance && usdtAllowance >= (value * (10 ** 18))) {
        setIsUSDTApproved(true);
      } else {
        setIsUSDTApproved(false);
      }
    }
    
    const { data: dedaAllowance } = useReadContract({
      address: tokenAddress as `0x${string}`,
      abi: abi,
      functionName: 'allowance',
      args: [address ?? '0x0000000000000000000000000000000000000000', contractAddress as `0x${string}`],
    });
  
    
    useEffect(() => {
      if (usdtAllowance && usdtAllowance >= USDTAmountToBuyWithDecimal) {
        setIsUSDTApproved(true);
      } else {
        setIsUSDTApproved(false);
      }
    },[usdtAllowance]);
  
    
  
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
      setIsUSDTApproveLoading(true)
      writeUSDTApproveContract(
        buyData.request,{
              onSuccess: () => {
                setTimeout(() => {
                  setIsUSDTApproved(true)
                  setIsUSDTApproveLoading(false);
                }, 15000)
            },
            onError: () => {
              setIsUSDTApproveLoading(false);
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
    },[dedaAllowance])
    function checkDEDAApproval(value: number){
      if (dedaAllowance && dedaAllowance >= (value * (10 ** 8))) {
        setIsDeDaApproved(true);
      } else {
        setIsDeDaApproved(false);
      }
    }
  
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
      setIsDeDaApproveLoading(true)
      writeDeDaApproveContract(
        sellData.request,{
              onSuccess: () => {
                setTimeout(() => {
                  setIsDeDaApproved(true)
                  setIsDeDaApproveLoading(false);
                }, 15000)
            },
            onError: () => {
              setIsDeDaApproveLoading(false);
            }
          }
      )
    }
  
    const handleSelectChange = (selectedOption: SingleValue<OptionType>) => {
      if(selectedOption){
        setDeDaIndexToSell(Number(selectedOption.value));
      }
    };
  
  
    const { selectOptions, setSelectOptions } = useStore()
    const [loadingOptions, setLoadingOptions] = useState(true);
  const account = getAccount(config)
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
    enabled: !!account.address
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

    const {showLowBalance, setShowLowBalance} = useStore();
    const [searchParams, setSearchParams] = useSearchParams();
    const [refCode, setRefCode] = useState("");
    const generateRefCode = ()=>{
      if(address){
      setRefCode(window.location.origin + "?ref=" + address)
      }else{}
    }
    return (
      <div>
        {/*  */}
        <section className="transactions">
                    <div className="transaction-panel">
                        <div className="panel-header">
                            <button 
                            onClick={() => toggleBuysell('buy')}
                            style={buysell === 'buy' ? {backgroundColor: "white", color: "black"} : {backgroundColor: "#26262f", color: "white"}} className="buy-button">Buy</button>
                            {!searchParams.get('ref')?<button 
                            onClick={() => toggleBuysell('sell')}
                            style={buysell === 'sell' ? {backgroundColor: "white", color: "black"} : {backgroundColor: "#26262f", color: "white"}} className="refund-button">Sell</button>: ""}
                            {!searchParams.get('ref')?<button 
                            onClick={() => toggleBuysell('cancel')}
                            style={buysell === 'cancel' ? {backgroundColor: "white", color: "black"} : {backgroundColor: "#26262f", color: "white"}} className="refund-button">Cancel</button>: ""}
                        </div>
                        {/* buy section */}
  
                        <div style={buysell === 'buy' ? {display: 'block'} : {display: 'none'}} className="sell-buy-section">
                            <h5>Tether to pay</h5>
                            <input type="text"
                            value={USDTAmountToBuy === 0 ? "" : USDTAmountToBuy.toString()}
                            onChange={(e) => {
                              let value = Number(e.target.value);
                              let finalPrice = RoundTwoPlaces((value / tokenPrice)  - (value / tokenPrice * 0.04))
                              console.log("finalPrice", finalPrice);
                              setUSDTAmountToBuy(value);
                              setFinalPriceWithDecimal(finalPrice);
                              checkUSDTApproval(value)
                              
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
                            <h5>inviter: </h5>
                            {searchParams.get('ref')?<input type="text" value={searchParams.get('ref')?.toString()}  placeholder='inviter' disabled/>:""}
                            
                            <div className='available-amount'>Available: {isConnected?
                              <ReadUSDTBalanceContract address={USDTAddress as `0x${string}`} decimal={18}/>
                              :"Connect your wallet"}
                            </div>
                            {/* <div>{isConnected? <LowBalanceTokenComponent showLowBalance={showLowBalance} lowBalanceFunc={(state: boolean)=>{setShowLowBalance(state)}} name={"USDT"} address={USDTAddress as `0x${string}`} userInput={USDTAmountToBuy}  decimal={18}/>:""}</div> */}
                            <p className='price-text'>&#9432; 1 DedaCoin = {tokenPrice !== 0? tokenPrice.toString() + ` Tether` : `Loading...`}</p>
                            <div style={{textAlign: "center", fontSize:"0.7em", paddingBottom:"10px"}}>The minimum purchase amount is set at 50 USDT.</div>
                            {searchParams.get('ref')?<button onClick={generateRefCode} style={{"backgroundColor": "#788181", "border": "none", "borderRadius":"5px", "padding": "8px"}}>Generate ref code</button>:""}
                            <br />
                            <br />
                            <div style={{fontSize:"10px"}}> <a target='_blank' style={{color: "green"}} href={refCode}>{refCode} </a></div>
                            <br />  
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
                                        const value = Number(e.target.value);
                                        if(data >= value){
                                          setDeDaAmountToSell(Number(e.target.value))
                                        }
                                        else{
                                          setDeDaAmountToSell(0)
                                        }
                                        checkDEDAApproval(value)
                                      }
                                    }
                                    placeholder="Amount" />
                            <button className='max-button'
                            onClick={() => {
                              const data = selectOptions.reduce((acc, option) => option.value == DeDaIndexToSell.toString() ? acc + (option.amount/10**8)! : acc, 0)
                              setDeDaAmountToSell(data)
                            }}
                            >Max</button>
                            <div className='available-amount'>Available: {isConnected?<ReadDeDaBalanceContract address={tokenAddress as `0x${string}`} decimal={8}/>:"Connect your wallet"}</div>
                            <h5>Tether you receive</h5>
                            <input type="text"
                            value={DeDaAmountToSell === 0 ? "" : (Number(DeDaAmountToSell) * selectOptions.reduce((acc, option) => option.value == DeDaIndexToSell.toString() ? acc + (option.purshase_price/(10**18) - (option.purshase_price/(10**18)*0.1) - (option.purshase_price/(10**18)*0.04))! : acc, 0)).toString()}
                            placeholder="Amount" disabled />
                            <p className='price-text'>&#9432; 1 DedaCoin = {tokenPrice? tokenPrice.toString() + ` Tether` : `Loading...`}</p>
                            {isDeDaApproved ? (
                              <SellTokensComponent />
                              ) : (
                                <button disabled={isDeDaApproveLoading} className="sell-button" onClick={handleSellApprove}>{ isDeDaApproveLoading ? "Processing..." : "Approve Dedacoin"}</button>
                              )}
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
                              <CancelTokensComponent />

                        </div>

                    </div>
                </section>
        {/*  */}
        
      </div>
    );
  }

export default TransactionComponent;
