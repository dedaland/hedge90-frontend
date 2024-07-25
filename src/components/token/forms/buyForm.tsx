import React, { useState, useEffect } from 'react';
import BuyTokensComponent from '../buyToken';
import ReadTokenBalanceContract from ''

const BuyForm = ({ isConnected, USDTAmountToBuy, tokenPrice, handleBuyApprove, isUSDTApproved, isUSDTApproveLoading, finalPriceWithDecimal, setUSDTAmountToBuy, setFinalPriceWithDecimal }:
  { isConnected:any, USDTAmountToBuy:any, tokenPrice:any, handleBuyApprove:any, isUSDTApproved:any, isUSDTApproveLoading:any, finalPriceWithDecimal:any, setUSDTAmountToBuy:any, setFinalPriceWithDecimal:any }
) => {
  const [tokenBalanceLow, setTokenBalanceLow] = useState(false);

  return (
    <div>
      <h5>Tether to pay</h5>
      <input
        type="text"
        value={USDTAmountToBuy === 0 ? "" : USDTAmountToBuy.toString()}
        onChange={(e) => {
          let value = Number(e.target.value);
          let finalPrice = RoundTwoPlaces((value / tokenPrice) - (value / tokenPrice * 0.04));
          setUSDTAmountToBuy(value);
          setFinalPriceWithDecimal(finalPrice);
        }}
        onBlur={(e) => {
          let value = Number(e.target.value);
          if (value < 50) {
            setUSDTAmountToBuy(50);
          }
        }}
        placeholder="Amount"
      />
      <h5>DedaCoin you receive</h5>
      <input type="string" value={finalPriceWithDecimal == 0 ? "" : RoundTwoPlaces(finalPriceWithDecimal).toString()} placeholder="Amount" disabled />
      <div className='available-amount'>
        Available: {isConnected ? <ReadTokenBalanceContract address={USDTAddress} decimal={18} userInput={USDTAmountToBuy} lowBalanceFunc={setTokenBalanceLow} /> : "Connect your wallet"}
      </div>
      <div>
        {isConnected ? <LowBalanceTokenComponent showLowBalance={tokenBalanceLow} lowBalanceFunc={setTokenBalanceLow} name={"USDT"} address={USDTAddress} userInput={USDTAmountToBuy} decimal={18} /> : ""}
      </div>
      <p className='price-text'>&#9432; 1 DedaCoin = {tokenPrice !== 0 ? tokenPrice.toString() + ` Tether` : `Loading...`}</p>
      <div style={{ textAlign: "center", fontSize: "0.7em", paddingBottom: "10px" }}>The minimum purchase amount is set at 50 USDT.</div>
      {isUSDTApproved ? (
        <BuyTokensComponent amountToBuy={USDTAmountToBuy * (10 ** 18)} dedaAmount={RoundTwoPlaces(finalPriceWithDecimal)} />
      ) : (
        <TokenApproval
          tokenAddress={USDTAddress}
          abi={abi}
          userAddress={address}
          contractAddress={contractAddress}
          amount={USDTAmountToBuy}
          decimal={18}
          approveText="Approve USDT"
          onSuccess={() => setIsUSDTApproved(true)}
          onError={() => setIsUSDTApproveLoading(false)}
        />
      )}
    </div>
  );
};

export default BuyForm;