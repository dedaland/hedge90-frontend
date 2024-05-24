import { ConnectButton } from '@rainbow-me/rainbowkit';
// import Select from 'react-select'
import Select, { StylesConfig, ThemeConfig } from 'react-select';

type OptionType = { label: string; value: string, imageUrl: string };

// const options = [
//   { value: 'chocolate', 
//   // label: 'Chocolate USDT<img src="" />' ,
//   label: <div><img src="" height="30px" width="30px"/>Chocolate </div>,
//   color: "black"},
//   { value: 'strawberry', label: 'Strawberry' , color: "black"},
//   { value: 'vanilla', label: 'Vanilla' , color: "black"}
// ]

const options: OptionType[] = [
  { value: 'option1', label: 'Option 1', imageUrl: '/time-past-svgrepo-com.svg' },
  { value: 'option2', label: 'Option 2', imageUrl: '/time-past-svgrepo-com.svg' },
  // Add more options as needed
];

const formatOptionLabel = ({ label, imageUrl }: OptionType) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <img src={imageUrl} alt="" style={{ marginRight: 10, width: 20, height: 20 }} />
    {label}
  </div>
);



const customStyles: StylesConfig<OptionType, false> = {
  container: (base, { isDisabled, isFocused }) => ({
    ...base,
    color: 'white',
    border: "#8a8aa0"
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
      style={{
        // display: 'flex',
        // justifyContent: 'flex-end',
        // padding: 12,
      }}
    >
      <header>
        {/* <div className="logo">
         <div>dedacoin</div> 
          
        </div>
        <div>
            <a href="#">ABOUT</a>
            <a href="#">HOW TO BUY</a>
            <a href="#">FAQS</a>
        </div> */}
        <div className="section">
        <div className='logo'>dedacoin</div> 
            <a href="#">ABOUT</a>
            <a href="#">HOW TO BUY</a>
            <a href="#">FAQS</a>
        </div>
        
        <div className="section">
            <ConnectButton />
            <div className="social-icons">
                <a href="#"><img width="35px" style={{ border: "0.1px solid rbga(255,255,255, 0.1)", borderRadius: "10px", backgroundColor: "#fff" }} src="/twitter-square-logo.svg" alt="" /></a>
                <a href="#"><img width="34px" style={{ border: "0.1px solid white", borderRadius: "10px", backgroundColor: "#fff" }} src="/telegram-logo2.svg" alt="" /></a>
            </div>
        </div>
    </header>
      <img className="mid-img" src="/pattern.svg" alt="pattern" />
      <section className="intro">
            <h1>Dedacoin</h1>
            <h2>The Future of Stable Investment</h2>
        </section>
        <section className="transactions">
            <div className="transaction-panel">
                <div className="panel-header">
                    <button className="buy-button">Buy</button>
                    <button className="refund-button">Refund</button>
                </div>


                <div className="previous-purchases">
                    <h3> <img width="15px" src="/time-past-svgrepo-com.svg" alt="" /> Previous Purchases</h3>
                    <Select
                      options={options}
                      styles={customStyles}
                      theme={customTheme}
                      formatOptionLabel={formatOptionLabel}
                    />
{/* 
                    <div className="purchase-item">
                        <p>5.09 DEDA ($160 Paid)</p>
                        <p>158.07 <span className="tether">T</span></p>
                    </div>
                    <div className="purchase-item">
                        <p>5.09 DEDA ($220 Paid)</p>
                        <p>219.02 <span className="tether">T</span></p>
                    </div>
                    <div className="purchase-item">
                        <p>42.105 DEDA ($100 Paid)</p>
                        <p>50.065 <span className="tether">T</span></p>
                    </div> */}
                    <p>Available: 5.09</p>
                </div>
                <div className="sell-section">
                    <h3>Tether you receive</h3>
                    <input type="text" placeholder="Amount" />
                    <p>1 Dedacoin = 0.9808 Tether</p>
                    <button className="sell-button">Sell Now</button>
                </div>
            </div>
        </section>

    </div>
  );
};

export default App;


// rgb(7 11 41);