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



const tokenAddress = '0x6B7Ff29582E0137C172dFB083Ff9Dd6c07C7D097';
const USDTAddress = '0x56Deb4F512867Fa7E2C951425Ac7be0162E66e3f';

// Address of the contract to spend the tokens
const contractAddress = '0x894974Bc5dD9CE85E7A4d0d729E77D9a6E4BDCC0';



function ReadTokenBalanceContract({address}: {address: string}) {
    const account = getAccount(config)
    const { data, isError, isLoading } = useReadContract({
      abi: abi,
      address: tokenAddress,
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
    address: contractAddress,
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
    address: contractAddress,
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



  const [DeDaAmountToBuy, setDeDaAmountToBuy] = useState(BigInt(0));
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
    address: USDTAddress,
    abi: abi,
    functionName: 'allowance',
    args: [address ?? '0x0000000000000000000000000000000000000000', contractAddress],
  });
  
  const { data: dedaAllowance } = useReadContract({
    address: tokenAddress,
    abi: abi,
    functionName: 'allowance',
    args: [address ?? '0x0000000000000000000000000000000000000000', contractAddress],
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
    address: USDTAddress,
    abi: abi,
    functionName: 'approve',
    args: [contractAddress, BigInt(2**53-1)],
  });

  const { writeContract: writeUSDTApproveContract } = useWriteContract()

  useEffect(() => {
    if (buyErr) {
      console.error("Failed to simulate contract approval.", buyErr);
    }
  }, []);

  const handleBuyApprove = () => {
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
    address: tokenAddress,
    abi: abi,
    functionName: 'approve',
    args: [contractAddress, BigInt(2**53-1)],
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
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const price_res = await axios.get(`http://localhost:3000/get-price`);
      setTokenPrice(price_res.data['price'])
      const response = await axios.get(`http://localhost:3000/get-user-purchases/${address}`);
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
    }, 5000);

    return () => {
        clearInterval(intervalId);
    };
// Only run this effect once, on mount
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);



  return (
    <div>
      {/*  */}
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
                            options={selectOptions}
                            styles={customStyles}
                            theme={customTheme}
                            formatOptionLabel={formatOptionLabel}
                            value={selectOptions.find(option => option.value === DeDaIndexToSell.toString())}
                            onChange={handleSelectChange}
                          />

                      </div>
                          <h5>DeDaCoin you pay</h5>
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
                          <p className='available-amount'>Available: {isConnected?<ReadTokenBalanceContract address={tokenAddress} />:"Connect your wallet"}</p>
                          <h5>Tether you receive</h5>
                          <input type="text"
                          value={DeDaAmountToSell == 0n ? "" : (Number(DeDaAmountToSell) * selectOptions.reduce((acc, option) => option.value == DeDaIndexToSell.toString() ? acc + (option.purshase_price/(10**6) - (option.purshase_price/(10**6)*0.1))! : acc, 0)).toString()}
                          // value={DeDaAmountToSell == 0n ? "" : (Number(DeDaAmountToSell) * selectOptions.map((option) => option.value == DeDaIndexToSell.toString() ? option.usdt_max : 0)).toString()}
                          placeholder="Amount" disabled />
                          <p className='price-text'>&#9432; 1 Dedacoin = {tokenPrice? tokenPrice.toString() + ` Tether` : `Loading...`}</p>
                          {isDeDaApproved ? (
                            <SellTokensComponent amountToSell={DeDaAmountToSellWithDecimal} index={DeDaIndexToSell} />
                            ) : (
                              <button disabled={isDeDaApproveLoading} className="sell-button" onClick={handleSellApprove}>{ isDeDaApproveLoading ? "Approving..." : "Approve Tokens"}</button>
                            )}
                          {/* <button className="sell-button">Sell Now</button> */}
                      </div>
                      {/* buy section */}

                      <div style={buysell == 'buy' ? {display: 'block'} : {display: 'none'}} className="sell-buy-section">
                          <h5>DeDaCoin you recieve</h5>
                          <input type="number"
                                  value={DeDaAmountToBuy == 0n ? "" : DeDaAmountToBuy.toString()}
                                  onChange={(e) => setDeDaAmountToBuy(BigInt(e.target.value))}
                                  placeholder="Amount" />
                          
                          <h5>Tether you pay</h5>
                          <input type="text" value={finalPriceWithDecimal == 0n ? "":(Number(finalPriceWithDecimal)/10**6).toString()} placeholder="Amount" disabled />
                          <p className='price-text'>&#9432; 1 Dedacoin = {tokenPrice? tokenPrice.toString() + ` Tether` : `Loading...`}</p>
                          {isUSDTApproved ? (
                            <BuyTokensComponent amountToBuy={DeDaAmountToBuyWithDecimal} />
                            ) : (
                              <button disabled={isUSDTApproveLoading} className="sell-button" onClick={handleBuyApprove}>{ isUSDTApproveLoading ? "Approving..." : "Approve Tokens"}</button>
                            )}
                          
                      </div>
                  </div>
              </section>
      {/*  */}
      
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
          dedacoin
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
                  <h1>Dedacoin</h1>
                  <h2>The Future of Stable Investment</h2>
              </section>
              <TransactionComponent />
          </div>
          <section className='how-to-buy'>
            <div className='section-title'>How to buy</div>
                <div className='secion-step'>step 01</div>
                <div className='section-step-title'>connect your crypto wallet</div>


                <div className='section-step-content'>securely connect your wallet to start buying <br/> or selling dedacoin</div>


                <div className='secion-step'>step 02</div>

                <div className='section-step-title'>buy dedacoin</div>



                <div className='section-step-content'>Purchase dedacoin with confidence. <br/>

                knowing your investment is protected.</div>


                <div className='secion-step'>step 03</div>

                <div className='section-step-title'>monitor and Trade</div>

                <div className='section-step-content'>easily track your investments and trade <br/>
                dedacoin on our intuitive platform</div>
          </section>

          <div className='key-feature-title'>Key Features</div>
          <section className='key-features'>
            
            <div className='key-feature-section-box'>
                <div className='key-feature-section-box-title'>
                Price stability
                </div>
                <div className='key-feature-section-box-content'>
                  Easily track your investments and 
                  trade Dedacoin on our intuitive
                  platform.
                </div>
            </div>
            <div className='key-feature-section-box'>
                <div className='key-feature-section-box-title'>
                High Liquidity
                </div>
                <div className='key-feature-section-box-content'>
                with a growing number of active
                users, Dedacoin offers high liquidity
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
              title="What is Dedacoin?"
              children={
                <div className='faq-answer'>Dedacoin is a cryptocurrency that offers a stable and secure way to invest in the crypto market. It is a decentralized platform that allows users to purchase, sell, and trade cryptocurrencies with ease.</div>
              }
              >
              </Collapsible>
              <Collapsible 
              title="What is Dedacoin?"
              children={
                <div className='faq-answer'>Dedacoin is a cryptocurrency that offers a stable and secure way to invest in the crypto market. It is a decentralized platform that allows users to purchase, sell, and trade cryptocurrencies with ease.</div>
              }
              >
              </Collapsible>
              <Collapsible 
              title="What is Dedacoin?"
              children={
                <div className='faq-answer'>Dedacoin is a cryptocurrency that offers a stable and secure way to invest in the crypto market. It is a decentralized platform that allows users to purchase, sell, and trade cryptocurrencies with ease.</div>
              }
              >
              </Collapsible>
              <Collapsible 
              title="What is Dedacoin?"
              children={
                <div className='faq-answer'>Dedacoin is a cryptocurrency that offers a stable and secure way to invest in the crypto market. It is a decentralized platform that allows users to purchase, sell, and trade cryptocurrencies with ease.</div>
              }
              >
              </Collapsible>
          </section>

          <section className='footer-section'>
            <div className="section">
                
                <div className='logo'><img width="30px" style={{paddingRight: "13px"}} src="/logo.png" alt="" />dedacoin</div> 
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

