import React, { useState, useEffect } from 'react';

const TermsAndConditions = () => {
    const [accepted, setAccepted] = useState(false);

    useEffect(() => {
        // Check localStorage for acceptance
        const isAccepted = localStorage.getItem('termsAccepted');
        if (isAccepted) {
            setAccepted(true);
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
            bottom: '20px',
            right: '20px',
            backgroundColor: '#26262F',
            padding: '20px',
            borderRadius: '5px',
            color: 'white',
            width: '300px', // You can adjust the width as needed
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            zIndex: 1000 // Ensure this value is higher than other elements on the page
        }}>
            <h2>Terms and Conditions</h2>
            <p>
                Please read and accept our terms and conditions. By accepting, you agree to comply with and be bound by the following terms and conditions of use.
            </p>
            {/* Add more terms and conditions text here */}
            <button 
                onClick={handleAccept} 
                style={{ 
                    backgroundColor: '#EFBD65', 
                    color: '#000', 
                    border: 'none', 
                    padding: '10px 20px', 
                    borderRadius: '5px', 
                    cursor: 'pointer',
                    marginTop: '10px',
                    width: '100%',
                    position: 'relative',
                    bottom: '0',
                    left: '0'
                }}
            >
                Accept
            </button>
        </div>
    );
};

export default TermsAndConditions;
