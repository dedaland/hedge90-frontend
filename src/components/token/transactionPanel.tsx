import React, { useState } from 'react';
import BuyForm from './forms/buyForm';
import SellForm from './forms/sellForm';
import CancelForm from './forms/cancelForm';

const TransactionPanel = () => {
  const [view, setView] = useState('buy');

  return (
    <div className='panel'>
      <div className='panel-buttons'>
        <button className={`switch-button ${view === 'buy' ? 'active' : ''}`} onClick={() => setView('buy')}>Buy</button>
        <button className={`switch-button ${view === 'sell' ? 'active' : ''}`} onClick={() => setView('sell')}>Sell</button>
        <button className={`switch-button ${view === 'cancel' ? 'active' : ''}`} onClick={() => setView('cancel')}>Cancel</button>
      </div>
      <div>
        {view === 'buy' && (
          <BuyForm
          />
        )}
        {view === 'sell' && (
          <SellForm/>
        )}
        {view === 'cancel' && <CancelForm />}  {/* Implement CancelForm similarly */}
      </div>
    </div>
  );
};

export default TransactionPanel;