import { ConnectButton } from '@rainbow-me/rainbowkit';
import Collapsible from './collapsible';

import TransactionComponent from './components/Transaction'

const App = () => {

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
                DedaCoin on our secure platform</div>
          </section>

          <div className='key-feature-title'>Key Features</div>
          <section className='key-features'>
            
            <div className='key-feature-section-box'>
                <div className='key-feature-section-box-title'>
                Price stability
                </div>
                <div className='key-feature-section-box-content'>
                  Easily track your investments and 
                  trade DedaCoin on our secure
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
                High security
                </div>
                <div className='key-feature-section-box-content'>
                By initiating the latest  blockchain technology
                we can ensure our users that all of their 
                transactions and their assets are 
                safely guarded in our platform
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
                You can complete the process by watching our tutorial video and following the step-by-step guides !
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
                  <b>Congratulations now you can see that deda coin has been successfully added to your wallet.</b>
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
              >
              </Collapsible>
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

