import { useState } from 'react';
import  { ConnectButton } from '../wallet-connect';
import { useLocation } from "react-router-dom";

import TransactionComponent from './Transaction'
import TermsAndConditions from './termAndConditions';
import PrivacyPolicy from './privacyPolicy'
import Collapsible from './collapsible';


const MainComponent = () => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const location = useLocation();
  const handlePrivacyPolicy = () => {
    setShowPrivacyPolicy(!showPrivacyPolicy);
    return showPrivacyPolicy
    // Add additional logic for when terms are accepted
  };

  const [accepted, setAccepted] = useState('true');
  const is_hedge90 =  location.pathname==="/hedge90";


  const handleAccept = (state: string) => {
    console.log("handleAccept", state)
    setAccepted(state);
    localStorage.setItem('termsAccepted', state);
  };

  return (
    
    <div
    className='body-section'>
      <header>

        <div className="section">
          <a href="https://dedacoin.co" target='_blank'>
            <img width="23px" style={{paddingRight: "13px"}} src="/logo.png" alt="" />
          </a>
        <div className='logo'>
          DedaCoin
          </div> 
        <div className='section-links'
        style={{
          height: is_hedge90?"64px":""
        }}>
            {is_hedge90?<a href="#what-is-hedge90" className='for-large-screen'>What is Hedge90</a>:""}
            <a href="#how-to-buy">HOW TO BUY</a>
            <a href="#faq-answer">FAQS</a>
            <a href="https://dedacoin.co/white-paper/" target='_blank'>Whitepaper</a>
        </div>
        </div>
        
        <div className="section">
            <ConnectButton/>

        </div>
        {/* <div className='header-space'></div> */}
    </header>
      {/* <img className="mid-img" src="/pattern.svg" alt="pattern" /> */}
      <div className='main-section'>
            <section className="intro">
                  <h1>DedaCoin</h1>
                 {is_hedge90?<h2>The Future of Stable Investment</h2>:
                  <h3>Join the ICO-Watch Your Investment Grow!</h3>}
              </section>
              <TransactionComponent />
          </div>
          {is_hedge90?<div id="what-is-hedge90" className='what-is-hedge90'>
            <h2>What is Hedge90 Trading?</h2>
            A strategy that follows market trends enabling you to profit during upward trends while safeguarding your capital during downward trends.
          </div>:""}
          <section id="how-to-buy" className='how-to-buy'>
            <div className='section-title'>How to buy</div>
            <ul className="bar">
              <li></li>
              <li></li>
              <li></li>
            </ul>
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
                DedaCoin on our secure platform</div>
          </section>

          {is_hedge90?<div>
          <div className='key-feature-title'>Key Features</div>
          <section className='key-features'>
            
            <div className='key-feature-section-box'>
                <div className='key-feature-section-box-title'>
                Non-upgradeable

                </div>
                <div className='key-feature-section-box-content'>
                Guarantees that the buyback protocol
                remains in place permanently,
                providing long-term security.
                <img style={{
                  width: "80px",
                  float: "right"
                }} src="/shinny.png" alt="" />
                </div>
            </div>
            <div className='key-feature-wide-box'>
                <div className='key-feature-wide-box-title'>
                Volatility Protection
                </div>
                <div className='key-feature-wide-box-title'>
                Secure & Permissionless
                </div>
                <div className='empty-box'></div>
                <div className='key-feature-wide-box-conent'>
                Transactions are voided if the underlying
                asset price fluctuates more than 100 basis
                points in a 60-second period,
                ensuring stability in volatile markets.

                </div>
                <div className='key-feature-wide-box-conent'>
                USDT used to purchase DedaCoins is locked
                in the Hedge90 contract to ensure sufficient
                liquidity and security for all user-invested capital.

                </div>
                <div className='key-feature-wide-box-img'>
                <img
                style={{
                  width: "100%",
                }}
                 src="/building-blocks.png" alt="" />
                </div>
                
            </div>
          </section></div>:""}
          <section id="faq-answer" className='faq-section'>
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
                You can complete the process by watching our tutorial video and following the step-by-step guides !
                </div>
              }
              />
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
                  <b>Congratulations now you can see that deda coin has been successfully added to your wallet.</b>
                  {/* You can see step by step in this video ! */}
                </ul>
                </div>
              }
              />
              {is_hedge90?
              <div>
              <Collapsible 
              title="How buy DedaCoin in Hedge90?"
              children={
                <div className='faq-answer'>
                  <ul>
                    <li>
                    You only have to complete this task for the first time purchase of deda on hege 90.
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
              />
              <Collapsible 
              title="How To Sell DedaCoin On Hedge90? (Cancellation Hedge90)"
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
              /></div>:""}
          </section>
          <div className='footer-parent'>
            <section className='footer-section'>
              <div className="section">
                  
                  <div className='logo'><img width="30px" style={{paddingRight: "13px"}} src="/logo.png" alt="" />DedaCoin</div> 
                  <div onClick={()=>{setShowPrivacyPolicy(!showPrivacyPolicy)}} style={{color:"white", cursor: "pointer"}}>|||||||| &#20; Privacy policy</div>
                  <div onClick={()=>{handleAccept('false')}} style={{color:"white", cursor: "pointer"}}>|||||||| &#20; Term and Conditions</div>
          <TermsAndConditions accepted={accepted} handleAccept={handleAccept}/>
          <PrivacyPolicy show={showPrivacyPolicy} toggleShow={handlePrivacyPolicy} />

              </div>
              
              <div className="section">
                  <div className="social-icons">
                      {/* <a href="https://x.com/dedacoin_co" target="_blank" rel="noopener noreferrer"><img width="35px" style={{ border: "0.1px solid #8a8aa0", borderRadius: "10px", background: "radial-gradient(closest-side, #3700AF, #3700AF, #3700AF)" }} src="/twitter-logo-n.svg" alt="" /></a> */}
                      <a href="https://t.me/DedaCoin_Official" target="_blank" rel="noopener noreferrer"><img width="34px" style={{ borderRadius: "40px", background: "#fff" }} src="/telegram-logo-n2.png" alt="" /></a>
                      <a href="https://x.com/dedacoin_co" target="_blank" rel="noopener noreferrer"><img width="34px" style={{ borderRadius: "40px", background: "#fff" }} src="/twitter-logo-n2.png" alt="" /></a>
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
    </div>
  );
};

export default MainComponent;

