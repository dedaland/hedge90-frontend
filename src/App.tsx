import { ConnectButton } from '@rainbow-me/rainbowkit';
import Collapsible from './collapsible';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios'

import Select, { StylesConfig, ThemeConfig, SingleValue } from 'react-select';
import { type BaseError, useWriteContract, useSimulateContract, useReadContract, useAccount } from 'wagmi'
import { getAccount } from '@wagmi/core'
import { abi } from './erc20_abi'
import { contract_abi } from './contract_abi'
import { config } from './wallet';
import TermsAndConditions from './termAndConditions';
import InvoiceModal from './savableTnx'


type OptionType = { label1: string; label2: string; value: string, imageUrl1: string, imageUrl2: string, purshase_price: number, amount: number };

type Purchase = {
  amount: number;
  pricePerToken: number;
  USDTAmount: number;
};






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



const tokenAddress = process.env.REACT_APP_TOKEN_ADDRESS;
const USDTAddress = process.env.REACT_APP_USDT_ADDRESS;

// Address of the contract to spend the tokens
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;



function ReadTokenBalanceContract({address}: {address: string}) {
    const account = getAccount(config)
    const { data, isError, isLoading } = useReadContract({
      abi: abi,
      address: tokenAddress as `0x${string}`,
      functionName: 'balanceOf',
      args: [account.address ?? '0x0000000000000000000000000000000000000000'],
      config: config
    })

    if (isLoading) {
      return "Loading..."
    }

    if (isError) {
      console.log("ERR", "Couldn't fetch balance")
      return ""
    }

    if(data){
      return (
        (Number(data)/(10**8)).toString()
      )
    }else{
      return "Couldn't fetch balance"
    }
}


function BuyTokensComponent({ amountToBuy }: { amountToBuy: bigint }) {
  const [isLoading, setisLoading] = useState(false);
  const [isPurchased, setisPurchased] = useState(false);

  const { data } = useSimulateContract({
    address: contractAddress as `0x${string}`,
    abi: contract_abi,
    functionName: 'buyTokens',
    args: [amountToBuy],
  });

  const { writeContract } = useWriteContract()

  return (
    <div>
      {isPurchased ? (
      <button className="sell-button">Successfully purchased</button>
     ) :
      (<button disabled={isLoading} className="sell-button" onClick={() => {
        setisLoading(true)
        writeContract(
          data!.request,{
            onSuccess: () => {
              setTimeout(() => {
                setisPurchased(true)
                setisLoading(false);
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

  const { data } = useSimulateContract({
    address: contractAddress as `0x${string}`,
    abi: contract_abi,
    functionName: 'returnTokens',
    args: [amountToSell, index],
  });

  const { writeContract } = useWriteContract()

  return (
    <div>
      {isPurchased ? (
      <button className="sell-button">Successfully returned</button>
     ) :
      (<button disabled={isLoading} className="sell-button" onClick={() => {
        setisLoading(true)
        writeContract(
          data!.request,{
            onSuccess: () => {
              setTimeout(() => {
                setisPurchased(true)
                setisLoading(false);
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

  const finalPriceWithDecimal = DeDaAmountToBuy * BigInt(tokenPrice * 10**6)

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
  }, [usdtAllowance, DeDaAmountToBuy]);


  

  // Prepare the write contract for the approve function
  const { data: buyData, error: buyErr } = useSimulateContract({
    address: USDTAddress as `0x${string}`,
    abi: abi,
    functionName: 'approve',
    args: [contractAddress as `0x${string}`, BigInt(2**53-1)],
  });

  const { writeContract: writeUSDTApproveContract } = useWriteContract()

  useEffect(() => {
    if (buyErr) {
      console.error("Failed to simulate contract approval.", buyErr);
    }
  }, []);

  const handleBuyApprove = () => {
    let amountToUse = DeDaAmountToBuy;
    if (amountToUse < 50n) {
      alert("Minimum DedaCoin to buy is 50!")
    }
    if (!buyData || !buyData.request) {
      console.error("Approval simulation data is not available.");
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
  }, [dedaAllowance, DeDaAmountToSell]);

  const { data: sellData, error: sellErr } = useSimulateContract({
    address: tokenAddress as `0x${string}`,
    abi: abi,
    functionName: 'approve',
    args: [contractAddress as `0x${string}`, BigInt(2**53-1)],
  });

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
      const data = response.data.map((item: any, index: number) => ({
         id: index,
         value: index,
         label1: `${item.amount / (10**8)} DEDA(at ${item.pricePerToken / (10**6)}$ price)`,
         imageUrl1: '/logo.png',
         label2: `${item.USDTAmount / (10**6)}`,
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

const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div>
      {/*  */}
      <InvoiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <section className="transactions">
                  <div className="transaction-panel">
                      <div className="panel-header">
                          <button 
                          onClick={() => toggleBuysell('buy')}
                          style={buysell == 'buy' ? {backgroundColor: "white", color: "black"} : {backgroundColor: "#26262f", color: "white"}} className="buy-button">Buy</button>
                          <button 
                          onClick={() => toggleBuysell('sell')}
                          style={buysell == 'sell' ? {backgroundColor: "white", color: "black"} : {backgroundColor: "#26262f", color: "white"}} className="refund-button">Sell</button>
                      </div>
                      {/* sell section */}
                      <div style={buysell == 'sell' ? {display: 'block'} : {display: 'none'}} className="sell-buy-section">
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
                                  value={DeDaAmountToSell == 0n ? "" : DeDaAmountToSell.toString()}
                                  onChange={
                                    (e) => {
                                      const data = selectOptions.reduce((acc, option) => option.value == DeDaIndexToSell.toString() ? acc + (option.amount/10**8)! : acc, 0)
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
                            const data = selectOptions.reduce((acc, option) => option.value == DeDaIndexToSell.toString() ? acc + (option.amount/10**8)! : acc, 0)
                            setDeDaAmountToSell(BigInt(data))
                          }}
                          >Max</button>
                          <p className='available-amount'>Available: {isConnected?<ReadTokenBalanceContract address={tokenAddress as `0x${string}`} />:"Connect your wallet"}</p>
                          <h5>Tether you receive</h5>
                          <input type="text"
                          value={DeDaAmountToSell == 0n ? "" : (Number(DeDaAmountToSell) * selectOptions.reduce((acc, option) => option.value == DeDaIndexToSell.toString() ? acc + (option.purshase_price/(10**6) - (option.purshase_price/(10**6)*0.1))! : acc, 0)).toString()}
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

                      <div style={buysell == 'buy' ? {display: 'block'} : {display: 'none'}} className="sell-buy-section">
                          <h5>DedaCoin you recieve</h5>
                          <input type="number"
                                  value={DeDaAmountToBuy == 0n ? "" : DeDaAmountToBuy.toString()}
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
                          <input type="text" value={finalPriceWithDecimal == 0n ? "":(Number(finalPriceWithDecimal)/10**6).toString()} placeholder="Amount" disabled />
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



const App = () => {
  // const [buysell, setBuysell] = useState('buy');
  // const { isConnected, address } = useAccount();
  // const [DeDaAmountToBuy, setDeDaAmountToBuy] = useState(BigInt(0));
  // function toggleBuysell(input: string) {
  //   setBuysell(input);
  // }

  return (
    
    <div
    className='body-section'>
      <header>

        <div className="section">
        <img width="30px" style={{paddingRight: "13px"}} src="/logo.png" alt="" />
        {/* <img width="30px" style={{paddingRight: "13px"}} src="/TetherUSDT.svg" alt="" /> */}

        <div className='logo'>
          DedaCoin
          </div> 
        <div className='section-links'>
            <a href="#">ABOUT</a>
            <a href="#">HOW TO BUY</a>
            <a href="#">FAQS</a>
        </div>
        </div>
        
        <div className="section">
            <ConnectButton showBalance={false} />
            <div className="social-icons">
                <a href="#"><img width="35px" style={{ border: "0.1px solid #8a8aa0", borderRadius: "10px", background: "radial-gradient(closest-side, #fff, #fff, #000)" }} src="/twitter-square-logo.svg" alt="" /></a>
                <a href="#"><img width="34px" style={{ border: "0.1px solid #8a8aa0", borderRadius: "10px", background: "radial-gradient(closest-side, #fff, #fff, #000)" }} src="/telegram-logo2.svg" alt="" /></a>
            </div>
        </div>
    </header>
      <img className="mid-img" src="/pattern.svg" alt="pattern" />
      <div className='main-section'>
            <section className="intro">
                  <h1>DedaCoin</h1>
                  <h2>The Future of Stable Investment</h2>
              </section>
              <TransactionComponent />
          </div>
          <section className='how-to-buy'>
            <div className='section-title'>How to buy</div>
                <div className='secion-step'>step 01</div>
                <div className='section-step-title'>connect your crypto wallet</div>


                <div className='section-step-content'>securely connect your wallet to start buying <br/> or selling DedaCoin</div>


                <div className='secion-step'>step 02</div>

                <div className='section-step-title'>buy DedaCoin</div>



                <div className='section-step-content'>Purchase DedaCoin with confidence. <br/>

                knowing your investment is protected.</div>


                <div className='secion-step'>step 03</div>

                <div className='section-step-title'>monitor and Trade</div>

                <div className='section-step-content'>easily track your investments and trade <br/>
                DedaCoin on our intuitive platform</div>
          </section>

          <div className='key-feature-title'>Key Features</div>
          <section className='key-features'>
            
            <div className='key-feature-section-box'>
                <div className='key-feature-section-box-title'>
                Price stability
                </div>
                <div className='key-feature-section-box-content'>
                  Easily track your investments and 
                  trade DedaCoin on our intuitive
                  platform.
                </div>
            </div>
            <div className='key-feature-section-box'>
                <div className='key-feature-section-box-title'>
                High Liquidity
                </div>
                <div className='key-feature-section-box-content'>
                with a growing number of active
                users, DedaCoin offers high liquidity
                for seamless buying and selling.
                </div>
            </div>
            <div className='key-feature-section-box'>
                <div className='key-feature-section-box-title'>
                Security first
                </div>
                <div className='key-feature-section-box-content'>
                Your transactions and holdings are
                safeguarded with latest in
                blockchain security measures
                </div>
            </div>
          </section>
          <section className='faq-section'>
            <div className='faq-title'>Frequently asked questions</div>
            <div className='faq-sub-title'>Find answers to some of your questions or contact us below</div>
              <Collapsible 
              title="How to install MetaMask?"
              children={
                <div className='faq-answer'>
                  <ul>
                  <li>Installing MetaMask Getting started with MetaMask is easy. Just go to https://metamask.io </li>
                  <li>click the “Download Now” button.</li>
                  <li>Note: going directly to the MetaMask website listed above is the best way to ensure you</li>
                  <li>download the correct software. Now, if you use Chrome, click Install MetaMask for Chrome.</li>
                </ul>
                You can see step by step in this video !
                </div>
              }
              >
              </Collapsible>
              <Collapsible 
              title="How to add Deda (BNB Chain) to MetaMask?"
              children={
                <div className='faq-answer'>
                  <ul>
                 <li>Open MetaMask Wallet</li> 
                 <li>In UP-Left side change network to Binance Smart Chain (BNB Chain)</li> 
                 <li>In Up-left side click, and select Expand View</li> 
                 <li>In this page select: “Import Tokens”</li> 
                 <li>Add Deda Contract Address in box:</li> 
                 <li>“0x15F9EB4b9BEaFa9Db35341c5694c0b6573809808”</li> 
                 <li>Press “ Next”</li> 
                 <li>Press “ Import”</li> 
                  <b>Congratulations! You now see DedaCoin (Deda) in your wallet.</b>
                  {/* You can see step by step in this video ! */}
                </ul>
                </div>
              }
              >
              </Collapsible>
              <Collapsible 
              title="How buy DedaCoin in Hedge90?"
              children={
                <div className='faq-answer'>
                  <ul>
                    <li>
                    Pre_Buy Task (just for first Time)
                      <ul>
                          <li>First, install the MetaMask (or Trust Wallet)</li>
                          <li>Add BNB Chain</li>
                          <li>Add DedaCoin to your wallet</li>
                      </ul>
                    </li>
                    <li> Go to https://hedge90.co</li>
                    (Be sure to watch out for fraudulent addresses. Buy exactly from our official address)
                    <li>Select the amount of DedaCoin you want to purchase based on the current price and</li>
                    click the buy button.
                    <li>The smart contract will automatically connect to your wallet and obtain the necessary
                    permissions.</li>
                    <li>The transactions are conducted on the blockchain, and the purchased DedaCoin will be
                    deposited into your wallet.</li>
                    <li>90% of the USDT you pay will be locked in the smart contract block in your favor, and you
                    can withdraw it anytime you wish.</li>
                    <b>Congratulations! Welcome to the large Deda community.</b>
                </ul>
                </div>
              }
              >
              </Collapsible>
              <Collapsible 
              title="How Sell DedaCoin in Hedge90? (Caselation Hedge90)"
              children={
                <div className='faq-answer'>
                  <ul>
                  <li>Go to https://hedge90.co</li>
                  <li>Select Sell TAB</li>
                  <li>Connect wallet process is running automatically.</li>
                  ( The wallet with which you bought DedaCoin on Hedge90 must be active on your
                  browser(
                  <li>Enter the amount of DedaCoin you want to sell.</li>
                  (If you have bought DedaCoin several times through Hedge90 , you can choose which of
                  your contracts you want to cancel.)
                  <li>The continuation of the process is done automatically through the smart contract, and
                  your guaranteed tethers will be transferred to your wallet, and DedaCoins will be returned
                  to the Deda liquidity pool.</li>
                  <b>Congratulations, you managed to complete your transaction with the least risk.</b>
                </ul>
                </div>
              }
              >
              </Collapsible>
          </section>

          <section className='footer-section'>
            <div className="section">
                
                <div className='logo'><img width="30px" style={{paddingRight: "13px"}} src="/logo.png" alt="" />DedaCoin</div> 
            </div>
            
            <div className="section">
                <div className="social-icons">
                    <a href="#"><img width="35px" style={{ border: "0.1px solid #8a8aa0", borderRadius: "10px", background: "radial-gradient(closest-side, #fff, #fff, #000)" }} src="/twitter-square-logo.svg" alt="" /></a>
                    <a href="#"><img width="34px" style={{ border: "0.1px solid #8a8aa0", borderRadius: "10px", background: "radial-gradient(closest-side, #fff, #fff, #000)" }} src="/telegram-logo2.svg" alt="" /></a>
                </div>
            </div>
          </section>
          <hr style={{border: "0.1px solid #EFBD65", width: "90%"}}/>
          <section className='copy-contact-section'>
              <div className='copyright'>
                © 2024 Dedacoin Rights Reserved.
              </div>
              <div className='contact-us'>
                Contact@dedacoin.com
              </div>
          </section>
    </div>
  );
};

export default App;

