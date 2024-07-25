import React, { useEffect, useState } from 'react';
import TransactionPanel from './transactionPanel';
import {customStyles, customTheme, formatOptionLabel, type OptionType} from '../theme/selectTheme';


const MainComponent = () => {
  const [tokenPrice, setTokenPrice] = useState(0);
  const [USDTAmountToBuy, setUSDTAmountToBuy] = useState(0);
  const [finalPriceWithDecimal, setFinalPriceWithDecimal] = useState(0);
  const [isUSDTApproved, setIsUSDTApproved] = useState(false);
  const [isUSDTApproveLoading, setIsUSDTApproveLoading] = useState(false);
  const [DeDaAmountToSell, setDeDaAmountToSell] = useState(0);
  const [DeDaIndexToSell, setDeDaIndexToSell] = useState(0);
  const [isDeDaApproved, setIsDeDaApproved] = useState(false);
  const [isDeDaApproveLoading, setIsDeDaApproveLoading] = useState(false);
  const [selectOptions, setSelectOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Fetch initial data such as tokenPrice, selectOptions, etc.
  }, []);

  const handleBuyApprove = () => {
    setIsUSDTApproveLoading(true);
    // handle USDT approval logic
  };

  const handleSellApprove = () => {
    setIsDeDaApproveLoading(true);
    // handle DeDa approval logic
  };

  return (
    <TransactionPanel
      isConnected={isConnected}
      tokenPrice={tokenPrice}
      USDTAmountToBuy={USDTAmountToBuy}
      finalPriceWithDecimal={finalPriceWithDecimal}
      setUSDTAmountToBuy={setUSDTAmountToBuy}
      setFinalPriceWithDecimal={setFinalPriceWithDecimal}
      isUSDTApproved={isUSDTApproved}
      handleBuyApprove={handleBuyApprove}
      isUSDTApproveLoading={isUSDTApproveLoading}
      DeDaAmountToSell={DeDaAmountToSell}
      DeDaIndexToSell={DeDaIndexToSell}
      setDeDaAmountToSell={setDeDaAmountToSell}
      setDeDaIndexToSell={setDeDaIndexToSell}
      isDeDaApproved={isDeDaApproved}
      handleSellApprove={handleSellApprove}
      isDeDaApproveLoading={isDeDaApproveLoading}
      selectOptions={selectOptions}
      loadingOptions={loadingOptions}
      customStyles={customStyles}
      customTheme={customTheme}
      formatOptionLabel={formatOptionLabel}
    />
  );
};

export default MainComponent;