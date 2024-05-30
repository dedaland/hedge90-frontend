import { ConnectButton } from '@rainbow-me/rainbowkit';
import Collapsible from './collapsible';
import { useState, useEffect, useCallback } from 'react';

import Select, { StylesConfig, ThemeConfig } from 'react-select';
import { type BaseError, useWriteContract, useSimulateContract, useReadContract, useAccount } from 'wagmi'
import { getAccount } from '@wagmi/core'
import { abi } from './erc20_abi'
import { contract_abi } from './contract_abi'
import { config } from './wallet';


type OptionType = { label: string; value: string, imageUrl: string };


const options: OptionType[] = [
  { value: 'option1', label: 'Option 1', imageUrl: '/time-past-svgrepo-com.svg' },
  { value: 'option2', label: 'Option 2', imageUrl: '/time-past-svgrepo-com.svg' }
];

const formatOptionLabel = ({ label, imageUrl }: OptionType) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <img src={imageUrl} alt="" style={{ marginRight: "10px", width: "20px", height: "20px" }} />
    {label}
  </div>
);



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




function ReadContract() {
    const account = getAccount(config)
    const { data, isError, isLoading } = useReadContract({
      abi: abi,
      address: '0xEfd0e778289B94f2c7a759829D750BDF113aBafD',
      functionName: 'balanceOf',
      args: [account.address ?? '0x0000000000000000000000000000000000000000'],//['0x2f5EF555ce682CB3F88623cC628b67fF0C4e90bD'],
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
        data?.toString()
      )
    }else{
      return "Couldn't fetch balance"
    }
}

const tokenAddress = '0x6B7Ff29582E0137C172dFB083Ff9Dd6c07C7D097';
const USDTAddress = '0x56Deb4F512867Fa7E2C951425Ac7be0162E66e3f';

// Address of the contract to spend the tokens
const spenderAddress = '0x5d4fC96A0f39182d8e1ECe4Dd006f9Da839B2Bea';

function BuyTokensComponent({ amountToBuy }: { amountToBuy: bigint }) {
  const [isLoading, setisLoading] = useState(false);
  const [isPurchased, setisPurchased] = useState(false);

  const { data } = useSimulateContract({
    address: spenderAddress,
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
        Buy Tokens
      </button>)}
    </div>
  );
}


function ApproveTokensComponent({ amountToApprove }: { amountToApprove: bigint }) {
  const { address } = useAccount();
  const [isApproved, setIsApproved] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const amountToApproveWithDecimal = amountToApprove * BigInt(10 ** 8)
    // NOTE: fetch price first
  const tokenPrice = BigInt(1.5 * 10**6)

  const amountToBuyWithDecimal = amountToApprove * tokenPrice

  // Read the allowance to check if the amount is already approved
  const { data: allowance } = useReadContract({
    address: USDTAddress,
    abi: abi,
    functionName: 'allowance',
    args: [address ?? '0x0000000000000000000000000000000000000000', spenderAddress],
  });

  useEffect(() => {
    if (allowance && allowance >= amountToBuyWithDecimal) {
      setIsApproved(true);
    } else {
      setIsApproved(false);
    }
  }, [allowance, amountToApprove]);

  // Prepare the write contract for the approve function
  const { data, error } = useSimulateContract({
    address: USDTAddress,
    abi: abi,
    functionName: 'approve',
    args: [spenderAddress, BigInt(2**53-1)],
  });

  const { writeContract } = useWriteContract()

  useEffect(() => {
    if (error) {
      console.error("Failed to simulate contract approval.", error);
    }
  }, []);

  const handleApprove = () => {
    if (!data || !data.request) {
      console.error("Approval simulation data is not available.");
      return;
      
    }
    setisLoading(true)
    writeContract(
          data.request,{
            onSuccess: () => {
              setTimeout(() => {
                setIsApproved(true)
                setisLoading(false);
              }, 15000)
          },
          onError: () => {
            setisLoading(false);
          }
        }
    )
  }

  return (
    <div>
      {isApproved ? (
      //  <button className="sell-button">Buy Now</button>
      // <BuyTokensComponent amountToBuy={amountToApprove} />
      <BuyTokensComponent amountToBuy={amountToApproveWithDecimal} />
      ) : (
        <button disabled={isLoading} className="sell-button" onClick={handleApprove}>{ isLoading ? "Approving..." : "Approve Tokens"}</button>
      )}
    </div>
  );
}



const App = () => {
  const [buysell, setBuysell] = useState('buy');
  const { isConnected, address } = useAccount();
  const [amountToApprove, setAmountToApprove] = useState(BigInt(0));
  function toggleBuysell(input: string) {
    setBuysell(input);
  }

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
                      <div style={buysell == 'sell' ? {display: 'block'} : {display: 'none'}} className="sell-buy-section">
                      <div className="previous-purchases">
                          <h3> <img width="15px" src="/time-past-svgrepo-com.svg" alt="" /> Previous Purchases</h3>
                          <Select
                            options={options}
                            styles={customStyles}
                            theme={customTheme}
                            formatOptionLabel={formatOptionLabel}
                          />

                      </div>
                          <h5>DeDaCoin you pay</h5>
                          <input type="text" placeholder="Amount" />
                          <button className='max-button'>Max</button>
                          <p className='available-amount'>Available: {isConnected?<ReadContract />:"Connect your wallet"}</p>
                          <h5>Tether you receive</h5>
                          <input type="text" placeholder="Amount" disabled />
                          <p className='price-text'>&#9432; 1 Dedacoin = 0.9808 Tether</p>
                          <button className="sell-button">Sell Now</button>
                      </div>

                      <div style={buysell == 'buy' ? {display: 'block'} : {display: 'none'}} className="sell-buy-section">
                          <h5>DeDaCoin you recieve</h5>
                          <input type="number"
                                  value={amountToApprove == 0n ? "" : amountToApprove.toString()}
                                  onChange={(e) => setAmountToApprove(BigInt(e.target.value))}
                                  placeholder="Amount" />
                          
                          <h5>Tether you pay</h5>
                          <input type="text" placeholder="Amount" disabled />
                          <p className='price-text'>&#9432; 1 Dedacoin = 0.9808 Tether</p>
                          <ApproveTokensComponent amountToApprove={amountToApprove} />
                          {/* <BuyTokensComponent amountToBuy={1000000000n} /> */}
                          
                      </div>
                  </div>
              </section>
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

