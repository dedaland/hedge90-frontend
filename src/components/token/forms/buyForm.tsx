import React, { useState, useEffect } from 'react';
import BuyTokensComponent from '../buyToken';
import ReadTokenBalanceContract from '../readTokenBalance'
import { LowBalanceTokenComponent } from '../lowBalanceToken'
import { RoundTwoPlaces } from '../../../utils/rounding'
import TokenApproval from '../tokenApproval'
import { getAccount, readContract } from '@wagmi/core'
import { abi } from '../../../constants/erc20_abi'
import useStore from '../../../store/store'
import { useAccount } from 'wagmi'

const USDTAddress = process.env.REACT_APP_USDT_ADDRESS;

const BuyForm = () => {
  const [tokenBalanceLow, setTokenBalanceLow] = useState(false);
  const { isConnected, address } = useAccount();
  const {
    USDTAmountToBuy,
    setUSDTAmountToBuy,
    tokenPrice,
    isUSDTApproved
  } = useStore()

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
          // setFinalPriceWithDecimal(finalPrice);
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
          contractAddress={contractAddress}
          amount={USDTAmountToBuy}
          decimal={18}
          approveText="Approve USDT"
        />
      )}
    </div>
  );
};

export default BuyForm;