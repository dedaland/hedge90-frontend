import React, { useState, useEffect } from 'react';

const TermsAndConditions = () => {
    const [accepted, setAccepted] = useState(true);

    useEffect(() => {
        // Check localStorage for acceptance
        const isAccepted = localStorage.getItem('termsAccepted');
        if (isAccepted != 'true') {
            setAccepted(false);
        }
    }, []);

    const handleAccept = () => {
        setAccepted(true);
        localStorage.setItem('termsAccepted', 'true');
        // Add additional logic for when terms are accepted
    };

    if (accepted) {
        return null; // Don't render the component if terms are accepted
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000, // Ensure this value is higher than other elements on the page
        }}>
            <div style={{
                backgroundColor: '#26262F',
                padding: '35px',
                borderRadius: '5px',
                color: 'white',
                width: '80%', // Adjust width as needed
                maxWidth: '500px', // Ensure it doesn't get too wide
                maxHeight: '80%', // Limit the height to 80% of the viewport
                overflowY: 'auto', // Make the modal scrollable if content overflows
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                fontSize: "13px",
                lineHeight: 1.6
            }}>
                <h2>Terms and Conditions for Purchasing DedaCoin Tokens</h2>
                <p>
                
                1. Guaranteed Value: Based on the Smart Contract, we guarantee 90% of the customer's price in Tether (USDT). <br />
                2. Cancellation Policy: Users can cancel the contract at any time by pressing the Hedge90 Sell button, allowing them to receive 90% of the purchase amount in Tether (USDT) in their wallet. <br />
                3. Blockchain Network: This smart contract operates on the Binance Smart Chain (BSC) blockchain network. All rules, security issues, risks, and transaction fees are based on the terms of this blockchain. We do not assume responsibility for these terms. <br />
                4. Hedge90 Fee: Users agree to pay a 4% fee of the purchase amount as the Hedge90 fee. <br />
                5. Participation Limit: Currently, there is no limit on the number of times users can
                participate in this process. <br />
                6. Smart Contract Execution: Upon executing the Hedge90 smart contract, for one-time <br />
                access, a withdrawal from the user's wallet for the amount of DedaCoin purchased and
                the usual fees will be given to the smart contract. <br />
                7. Pricing Reference: Our sales price reference is available in the Hedge90 OTC section of
                the DedaBit centralized exchange. <br />
                8. Minimum amount to purchase is 50 DEDA <br />
                9. Compliance: Users are required to comply with all rules and regulations related to the
                use and purchase of DedaCoin tokens. <br />
                10. Acceptance of Terms: Using the Hedge90 smart contract implies acceptance of all terms
                and conditions stated in this document. <br />
                11. User Responsibility: Users are responsible for storing and protecting purchased tokens 
                and must take all necessary security measures to prevent unauthorized access. 11. Legal Use: DedaCoin tokens are only for legal and authorized purposes. Any
                unauthorized or illegal use is prohibited. <br />
                12. Limitation of Liability: The company assumes no responsibility for damages resulting
                from cyber-attacks or the loss of tokens due to user negligence. <br />
                13. User Acknowledgment: By clicking on the "Confirm" button, users acknowledge that
                they have read and agree to all the above terms and conditions. <br />

                    </p>
                <div style={{
                    position: 'sticky',
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <div style={{
                        width: '100%',
                        height: '300px',
                        background: 'linear-gradient(to top, #26262F, rgba(38, 38, 47, 0))',
                        position: 'absolute',
                        bottom: '-36px' // Adjust to ensure it is above the button
                    }}></div>
                    <button 
                        onClick={handleAccept} 
                        style={{ 
                            backgroundColor: '#EFBD65', 
                            color: '#000', 
                            border: 'none', 
                            padding: '10px 20px', 
                            borderRadius: '5px', 
                            cursor: 'pointer',
                            width: '100%',
                            zIndex: 1 // Ensure the button is above the gradient
                        }}
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
