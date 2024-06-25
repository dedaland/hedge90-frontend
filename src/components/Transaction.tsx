import { useState, useEffect } from 'react';
import { type BaseError, useWriteContract, useSimulateContract, useReadContract, useAccount } from 'wagmi'
import Select, { StylesConfig, ThemeConfig, SingleValue } from 'react-select';
import { abi } from '../erc20_abi'
import axios from 'axios'
import { contract_abi } from '../contract_abi'
import { getAccount } from '@wagmi/core'
import { wagmiConfig as config } from '../wallet-connect';
import InvoiceModal from './savableTnx'
import TermsAndConditions from './termAndConditions';




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


function ReadTokenBalanceContract({address, decimal}: {address: string, decimal: number}) {
    const account = getAccount(config)
    const { data, error, isError, isLoading } = useReadContract({
      abi: abi,
      address: address as `0x${string}`,
      functionName: 'balanceOf',
      args: [account.address ?? '0x0000000000000000000000000000000000000000'],
      config: config
    })

    if (isLoading) {
      return "Loading..."
    }

    if (isError) {
      console.log("ERR", "Couldn't fetch balance", error)
      return ""
    }

    if(typeof data === "bigint"){
      return (
        (Number(data)/(10**decimal)).toString()
      )
    }else{
      return "Couldn't fetch balance"
    }
}

function BuyTokensComponent({ amountToBuy }: { amountToBuy: bigint }) {
    const [isLoading, setisLoading] = useState(false);
    const [isPurchased, setisPurchased] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tnxHash, setTnxHash] = useState("0x");
  
    const { data } = useSimulateContract({
      address: contractAddress as `0x${string}`,
      abi: contract_abi,
      functionName: 'buyTokens',
      args: [amountToBuy],
    });
  
    const { writeContract } = useWriteContract()
  
    return (
      <div>
          <InvoiceModal isOpen={isModalOpen} amount={(Number(amountToBuy)/10**8)} tnxId={tnxHash} action='purchase' onClose={() => setIsModalOpen(false)} />
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
            onError: () => {
              setisLoading(false);
            }
          }
      )
    }
    }>
          { isLoading ? "Purchasing..." : "Buy DedaCoin"}
        </button>)}
      </div>
    );
  }
  
  
  function SellTokensComponent({ amountToSell, index }: { amountToSell: bigint, index: bigint }) {
    const [isLoading, setisLoading] = useState(false);
    const [isPurchased, setisPurchased] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tnxHash, setTnxHash] = useState("0x");
  
    const { data } = useSimulateContract({
      address: contractAddress as `0x${string}`,
      abi: contract_abi,
      functionName: 'returnTokens',
      args: [amountToSell, index],
    });
  
    const { writeContract } = useWriteContract()
  
    return (
      <div>
        <InvoiceModal isOpen={isModalOpen} amount={(Number(amountToSell)/10**8)} tnxId={tnxHash} action='return' onClose={() => setIsModalOpen(false)} />
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
          { isLoading ? "Returning..." : "Return DedaCoin"}
        </button>)}
      </div>
    );
  }



function TransactionComponent(){//({ DeDaAmountToBuy }: { DeDaAmountToBuy: bigint }) {
    // const { address } = useAccount();
    const [isUSDTApproved, setIsUSDTApproved] = useState(false);
    const [isUSDTApproveLoading, setisUSDTApproveLoading] = useState(false);
  
  
    const [isDeDaApproved, setIsDeDaApproved] = useState(false);
    const [isDeDaApproveLoading, setisDeDaApproveLoading] = useState(false);
    // 
    const [buysell, setBuysell] = useState('buy');
    const { isConnected, address } = useAccount();
  
  
  
    const [DeDaAmountToBuy, setDeDaAmountToBuy] = useState(BigInt(50));
    const [DeDaAmountToSell, setDeDaAmountToSell] = useState(BigInt(0));
    const [DeDaIndexToSell, setDeDaIndexToSell] = useState(BigInt(0));
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
    const DeDaAmountToBuyWithDecimal = DeDaAmountToBuy * BigInt(10 ** 8)
    const DeDaAmountToSellWithDecimal = DeDaAmountToSell * BigInt(10 ** 8)
      // NOTE: fetch price first
    // const tokenPrice = 1
  
    const finalPriceWithDecimal = DeDaAmountToBuy * BigInt(tokenPrice?tokenPrice:0 * 10**18)
  
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
      if (usdtAllowance && usdtAllowance >= finalPriceWithDecimal) {
        setIsUSDTApproved(true);
      } else {
        setIsUSDTApproved(false);
      }
    }, [usdtAllowance, DeDaAmountToBuy, finalPriceWithDecimal]);
  
  
    
  
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
      let amountToUse = DeDaAmountToBuy;
      if (amountToUse < 50n) {
        alert("Minimum DedaCoin to buy is 50!")
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
        setDeDaIndexToSell(BigInt(selectedOption.value));
      }
    };
  
  
    const [selectOptions, setSelectOptions] = useState<OptionType[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(true);
    useEffect(() => {
      const intervalId = setInterval(async () => {
        const account = getAccount(config)
        try{
        const price_res = await axios.get(process.env.REACT_APP_BACKEND_URL + `/get-price`);
        setTokenPrice(price_res.data['price'])
        }catch(err){
          console.log("NO PRICE")
        }
        try{
        setLoadingOptions(true)
        const response = await axios.get(process.env.REACT_APP_BACKEND_URL + `/get-user-purchases/${account.address}`);
        const data = response.data
        .map((item: any, index: number) => ({
          ...item,
          originalIndex: index
        }))
        .filter((item: any) => item.amount !== "0")
        .map((item: any, index: number) => ({
           id: item.originalIndex,
           value: item.originalIndex,
           label1: `${item.amount / (10**8)} DEDA(at ${item.pricePerToken / (10**18)}$ price)`,
           imageUrl1: '/logo.png',
           label2: `${item.USDTAmount / (10**18)}`,
           purshase_price: item.pricePerToken,
           amount: item.amount,
           imageUrl2: '/TetherUSDT.svg' 
          }));
  
        console.log("DATA", data)
        setSelectOptions(data)
        setLoadingOptions(false)
        }catch(err: any){
          console.log("NO USER PURCHASES")
        }
  
      }, 5000);
  
      return () => {
          clearInterval(intervalId);
      };
  // Only run this effect once, on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
    const [usdtBalanceLow, setUsdtBalanceLow] = useState(false);
  
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
                                    value={DeDaAmountToSell === 0n ? "" : DeDaAmountToSell.toString()}
                                    onChange={
                                      (e) => {
                                        const data = selectOptions.reduce((acc, option) => option.value === DeDaIndexToSell.toString() ? acc + (option.amount/10**8)! : acc, 0)
                                        if(data >= Number(e.target.value)){
                                          setDeDaAmountToSell(BigInt(e.target.value))
                                        }
                                        else{
                                          setDeDaAmountToSell(BigInt(0))
                                        }
                                      }
                                    }
                                    // max={selectOptions.reduce((acc, option) => option.value == DeDaIndexToSell.toString() ? acc + (option.amount/10**8)! : acc, 0)}
                                    placeholder="Amount" />
                            <button className='max-button'
                            onClick={() => {
                              const data = selectOptions.reduce((acc, option) => option.value === DeDaIndexToSell.toString() ? acc + (option.amount/10**8)! : acc, 0)
                              setDeDaAmountToSell(BigInt(data))
                            }}
                            >Max</button>
                            <p className='available-amount'>Available: {isConnected?<ReadTokenBalanceContract address={tokenAddress as `0x${string}`} decimal={8} />:"Connect your wallet"}</p>
                            <h5>Tether you receive</h5>
                            <input type="text"
                            value={DeDaAmountToSell === 0n ? "" : (Number(DeDaAmountToSell) * selectOptions.reduce((acc, option) => option.value === DeDaIndexToSell.toString() ? acc + (option.purshase_price/(10**18) - (option.purshase_price/(10**18)*0.1))! : acc, 0)).toString()}
                            // value={DeDaAmountToSell == 0n ? "" : (Number(DeDaAmountToSell) * selectOptions.map((option) => option.value == DeDaIndexToSell.toString() ? option.usdt_max : 0)).toString()}
                            placeholder="Amount" disabled />
                            <p className='price-text'>&#9432; 1 DedaCoin = {tokenPrice? tokenPrice.toString() + ` Tether` : `Loading...`}</p>
                            {isDeDaApproved ? (
                              <SellTokensComponent amountToSell={DeDaAmountToSellWithDecimal} index={DeDaIndexToSell} />
                              ) : (
                                <button disabled={isDeDaApproveLoading} className="sell-button" onClick={handleSellApprove}>{ isDeDaApproveLoading ? "Approving..." : "Approve Tokens"}</button>
                              )}
                            {/* <button className="sell-button">Sell Now</button> */}
                        </div>
                        {/* buy section */}
  
                        <div style={buysell === 'buy' ? {display: 'block'} : {display: 'none'}} className="sell-buy-section">
                            <h5>DedaCoin you recieve</h5>
                            <div style={{color: "red", display: usdtBalanceLow?"block":"none"}}>your USDT balance is too low!</div>
                            <input type="number"
                                    value={DeDaAmountToBuy === 0n ? "" : DeDaAmountToBuy.toString()}
                                    onChange={(e) => {
                                      let value = BigInt(e.target.value);
                                      setDeDaAmountToBuy(value);
                                  }}
                                  onBlur={(e) => {
                                      let value = BigInt(e.target.value);
                                      if (value < 50n) {
                                          setDeDaAmountToBuy(50n);
                                      }
                                  }}
                                    placeholder="Amount" />
                            
                            <h5>Tether to pay</h5>
                            <input type="text" value={finalPriceWithDecimal === 0n ? "":(Number(finalPriceWithDecimal)/10**18).toString()} placeholder="Amount" disabled />
                            <p className='available-amount'>Available: {isConnected?<ReadTokenBalanceContract address={USDTAddress as `0x${string}`} decimal={18} />:"Connect your wallet"}</p>
                            <p className='price-text'>&#9432; 1 DedaCoin = {tokenPrice? tokenPrice.toString() + ` Tether` : `Loading...`}</p>
                            {isUSDTApproved ? (
                              <BuyTokensComponent amountToBuy={DeDaAmountToBuyWithDecimal} />
                              ) : (
                                <button disabled={isUSDTApproveLoading} className="sell-button" onClick={handleBuyApprove}>{ isUSDTApproveLoading ? "Approving..." : "Approve Tokens"}</button>
                              )}
                            
                        </div>
                    </div>
                </section>
        {/*  */}
        <TermsAndConditions/>
        
      </div>
    );
  }

export default TransactionComponent;
