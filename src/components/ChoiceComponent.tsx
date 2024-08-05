import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import TermsAndConditions from './termAndConditions';
import PrivacyPolicy from './privacyPolicy'

function ChoiceComponent() {

    const [searchParams] = useSearchParams();
    const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
    const handlePrivacyPolicy = () => {
        setShowPrivacyPolicy(!showPrivacyPolicy);
        return showPrivacyPolicy
        // Add additional logic for when terms are accepted
    };

    const [accepted, setAccepted] = useState('true');


    const handleAccept = (state: string) => {
        console.log("handleAccept", state)
        setAccepted(state);
        localStorage.setItem('termsAccepted', state);
    };
    const referralCode = searchParams.get('ref') ? `?ref=` + searchParams.get('ref') : ``;
    return (
        <div style={{ color: "white" }}>
            <header
            style={{
                // height:"100px",
                borderBottomLeftRadius:"40px",
                borderBottomRightRadius:"40px"
            }}>
                <div className="section">
                    <a href="https://dedacoin.co" target='_blank' rel="noopener noreferrer">
                        <img width="30px" style={{ paddingRight: "13px" }} src="/logo.png" alt="" />
                    </a>
                    <div className='logo'>
                        DedaCoin
                    </div>
                </div>
                <div className="social-icons">
                    <a href="https://x.com/dedacoin_co" target="_blank" rel="noopener noreferrer"><img width="35px" style={{ border: "0.1px solid #8a8aa0", borderRadius: "10px", background: "radial-gradient(closest-side, #fff, #fff, #000)" }} src="/twitter-square-logo.svg" alt="" /></a>
                    <a href="https://t.me/DedaCoin_Official" target="_blank" rel="noopener noreferrer"><img width="34px" style={{ border: "0.1px solid #8a8aa0", borderRadius: "10px", background: "radial-gradient(closest-side, #fff, #fff, #000)" }} src="/telegram-logo2.svg" alt="" /></a>
                </div>
            </header>
            <div className='choice-box'>
                <div style={{
                    color: "black"
                }}>
                    <h1> Congratulations on joining the large Deda community.</h1>
                    <h3>You have accessed this page through the Referral Program link, giving you the chance to purchase DedaCoin with a 1% discount.</h3>
                    <h3>You can receive the purchased tokens in your wallet via this secure and transparent smart contract.</h3>
                </div>
                <div className='choice-flex'>
                    <div className='choice-box-child'>
                        <div style={{ flexGrow: 1 }}>
                            <h3>Buy DedaCoin in HEDGE90</h3>
                            <ul style={{
                                lineHeight: "2"
                            }}>
                                <li>90% Purchase Price Guarantee</li>
                                <li>4% Guarantee Commission</li>
                                <li>1% Discount</li>
                                <li>Minimum Purchase of 50 USDT</li>
                                <li>Ability to Cancel the Guarantee</li>
                                <li>Ability to Sell through the Smart Contract at 90% of the Purchase Price</li>
                                <li>Ability to Sell Purchased DedaCoin on Reputable Exchanges</li>
                            </ul>
                        </div>
                        <a href={`#` + referralCode} style={{ alignSelf: "flex-end", margin: "auto auto" }}>
                            <button
                            disabled
                                style={{
                                    borderRadius: "25px",
                                    width: "200px",
                                    padding: "17px",
                                    cursor: "pointer",
                                    backgroundColor:"#EFBD65",
                                    border:"none"
                                }}
                            >Coming soon</button>
                        </a>
                    </div>
                    <div className='choice-box-child'>
                        <div style={{ flexGrow: 1 }}>
                            <h3>Buy DedaCoin</h3>
                            <ul
                                style={{
                                    lineHeight: "2"
                                }}>
                                <li>Purchase DedaCoin through Smart Contract 1% Purchase Discount</li>
                                <li>Ability to Sell DedaCoin on Reputable Exchanges</li>
                                <li>Minimum Purchase of 50 USDT</li>
                            </ul>
                        </div>
                        <a href={`/referral` + referralCode} style={{ alignSelf: "flex-end", margin: "auto auto" }}>
                            <button
                                style={{
                                    borderRadius: "25px",
                                    border:"none",
                                    width: "200px",
                                    padding: "17px",
                                    cursor: "pointer",
                                    backgroundColor:"#EFBD65"
                                }}
                            >Buy now</button>
                        </a>
                    </div>
                </div>
            </div>
            <div className='footer-parent'>
            <section className='footer-section'>
                <div className="section">

                    <div className='logo'><img width="30px" style={{ paddingRight: "13px" }} src="/logo.png" alt="" />DedaCoin</div>
                    <div onClick={() => { setShowPrivacyPolicy(!showPrivacyPolicy) }} style={{ color: "white", cursor: "pointer" }}>|||||||| &#20; Privacy policy</div>
                    <div onClick={() => { handleAccept('false') }} style={{ color: "white", cursor: "pointer" }}>|||||||| &#20; Term and Conditions</div>
                    <TermsAndConditions accepted={accepted} handleAccept={handleAccept} />
                    <PrivacyPolicy show={showPrivacyPolicy} toggleShow={handlePrivacyPolicy} />

                </div>

                <div className="section">
                    <div className="social-icons">
                        <a href="https://x.com/dedacoin_co" target="_blank" rel="noopener noreferrer"><img width="35px" style={{ border: "0.1px solid #8a8aa0", borderRadius: "10px", background: "radial-gradient(closest-side, #fff, #fff, #000)" }} src="/twitter-square-logo.svg" alt="" /></a>
                        <a href="https://t.me/DedaCoin_Official" target="_blank" rel="noopener noreferrer"><img width="34px" style={{ border: "0.1px solid #8a8aa0", borderRadius: "10px", background: "radial-gradient(closest-side, #fff, #fff, #000)" }} src="/telegram-logo2.svg" alt="" /></a>
                    </div>
                </div>
            </section>
            </div>
            <hr style={{ border: "0.1px solid #EFBD65", width: "90%" }} />
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
}

export default ChoiceComponent;