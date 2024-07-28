import React, { useState, useEffect } from 'react';

const PrivacyPolicy = ({ show, toggleShow }: { show: boolean, toggleShow: any }) => {
    const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(show);

    return (
        <div
            style={
                {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(5px)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: show ? 'flex' : 'none',

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
                <h2>Privacy Policy</h2>
                <p>



                    Effective Date: June 2024 <br />

                    Welcome to Hedge90! We respect your privacy and are committed to protecting your personal information. This privacy policy outlines how we collect, use, and safeguard your data when you visit our website.  <br />

                    1. Information Collection  <br />
                    - Personal Data: We collect personal information that you provide to us, such as your name, email address, and any other contact details when you sign up for our services or newsletters.  <br />
                    - Usage Data: Information on how the website is accessed and used, which may include your IP address, browser type, and version, the pages you visit, the time and date of your visit, and other diagnostic data.  <br />

                    2. Use of Information  <br />
                    - To provide and maintain our service  <br />
                    - To notify you about changes to our service  <br />
                    - To provide customer support  <br />
                    - To gather analysis or valuable information so that we can improve our website  <br />
                    - To monitor the usage of our website  <br />
                    - To detect, prevent and address technical issues  <br />

                    3. Data Sharing  <br />
                    We do not sell, trade, or otherwise transfer your Personally Identifiable Information to outside parties unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users.  <br />

                    4. Data Security  <br />
                    We strive to use commercially acceptable means to protect your Personal Data, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure.  <br />

                    5. Your Data Rights  <br />
                    - Access: You can request copies of your personal data.  <br />
                    - Rectification: You can request that we correct any information you believe is inaccurate or incomplete.  <br />
                    - Erasure: You can request that we erase your personal data under certain conditions.  <br />

                    6. Changes to This Privacy Policy  <br />
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.  <br />


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
                        onClick={toggleShow}
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

export default PrivacyPolicy;
