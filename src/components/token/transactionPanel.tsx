import React, { useState } from 'react';
import BuyForm from './forms/buyForm';
import SellForm from './forms/sellForm';
import CancelForm from './forms/cancelForm';  // Create this similarly to BuyForm and SellForm

const TransactionPanel = ({ isConnected, tokenPrice, USDTAmountToBuy, finalPriceWithDecimal, setUSDTAmountToBuy, setFinalPriceWithDecimal, isUSDTApproved, handleBuyApprove, isUSDTApproveLoading, DeDaAmountToSell, DeDaIndexToSell, setDeDaAmountToSell, setDeDaIndexToSell, isDeDaApproved, handleSellApprove, isDeDaApproveLoading, selectOptions, loadingOptions, customStyles, customTheme, formatOptionLabel }:
    { isConnected:any, tokenPrice:any, USDTAmountToBuy:any, finalPriceWithDecimal:any, setUSDTAmountToBuy:any, setFinalPriceWithDecimal:any, isUSDTApproved:any, handleBuyApprove:any, isUSDTApproveLoading:any, DeDaAmountToSell:any, DeDaIndexToSell:any, setDeDaAmountToSell:any, setDeDaIndexToSell:any, isDeDaApproved:any, handleSellApprove:any, isDeDaApproveLoading:any, selectOptions:any, loadingOptions:any, customStyles:any, customTheme:any, formatOptionLabel:any }
) => {
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
            isConnected={isConnected}
            USDTAmountToBuy={USDTAmountToBuy}
            tokenPrice={tokenPrice}
            handleBuyApprove={handleBuyApprove}
            isUSDTApproved={isUSDTApproved}
            isUSDTApproveLoading={isUSDTApproveLoading}
            finalPriceWithDecimal={finalPriceWithDecimal}
            setUSDTAmountToBuy={setUSDTAmountToBuy}
            setFinalPriceWithDecimal={setFinalPriceWithDecimal}
          />
        )}
        {view === 'sell' && (
          <SellForm
            isConnected={isConnected}
            DeDaAmountToSell={DeDaAmountToSell}
            tokenPrice={tokenPrice}
            DeDaIndexToSell={DeDaIndexToSell}
            setDeDaAmountToSell={setDeDaAmountToSell}
            setDeDaIndexToSell={setDeDaIndexToSell}
            handleSellApprove={handleSellApprove}
            isDeDaApproved={isDeDaApproved}
            isDeDaApproveLoading={isDeDaApproveLoading}
            selectOptions={selectOptions}
            loadingOptions={loadingOptions}
            customStyles={customStyles}
            customTheme={customTheme}
            formatOptionLabel={formatOptionLabel}
          />
        )}
        {view === 'cancel' && <CancelForm />}  {/* Implement CancelForm similarly */}
      </div>
    </div>
  );
};

export default TransactionPanel;