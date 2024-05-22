import { ConnectButton } from '@rainbow-me/rainbowkit';

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
                <a href="#"><img width="35px" style={{ border: "0.5px solid white", borderRadius: "10px", backgroundColor: "#fff" }} src="/twitter-square-logo.svg" alt="" /></a>
                <a href="#"><img width="34px" style={{ border: "0.5px solid white", borderRadius: "10px", backgroundColor: "#fff" }} src="/telegram-logo2.svg" alt="" /></a>
            </div>
        </div>
    </header>
      <img className="mid-img" src="/pattern.svg" alt="pattern" />

    </div>
  );
};

export default App;


// rgb(7 11 41);