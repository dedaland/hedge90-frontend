import { ConnectButton } from '@rainbow-me/rainbowkit';
import Collapsible from './collapsible';

import Select, { StylesConfig, ThemeConfig } from 'react-select';

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


const App = () => {
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
            <ConnectButton />
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
                          <button style={{backgroundColor: "#26262f", color: "white"}} className="buy-button">Buy</button>
                          <button style={{backgroundColor: "white", color: "black"}} className="refund-button">Refund</button>
                      </div>


                      <div className="previous-purchases">
                          <h3> <img width="15px" src="/time-past-svgrepo-com.svg" alt="" /> Previous Purchases</h3>
                          <Select
                            options={options}
                            styles={customStyles}
                            theme={customTheme}
                            formatOptionLabel={formatOptionLabel}
                          />

                      </div>
                      <div className="sell-section">
                          <h5>DeDaCoin you pay</h5>
                          <input type="text" placeholder="Amount" />
                          <button className='max-button'>Max</button>
                          <p className='available-amount'>Available: 5.09</p>
                          <h5>Tether you receive</h5>
                          <input type="text" placeholder="Amount" disabled />
                          <p className='price-text'>&#9432; 1 Dedacoin = 0.9808 Tether</p>
                          <button className="sell-button">Sell Now</button>
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

