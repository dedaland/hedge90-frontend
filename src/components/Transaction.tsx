import { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { SingleValue } from 'react-select';
import { getAccount } from '@wagmi/core'
import { wagmiConfig as config } from '../wallet-connect';
import useStore from '../store/store'
import CancelFormComponent from './forms/cancelForm'
import BuyFormComponent from './forms/buyForm'
import SellFormComponent from './forms/sellForm';
import {RoundTwoPlaces} from '../utils/functions'
import {fetchPrice} from '../utils/fetch'
import {OptionType} from '../utils/types'


function TransactionComponent() {
  const {buysell, setBuysell} = useStore();



  const { USDTAmountToBuy } = useStore();
  const { setDeDaIndexToSell } = useStore()
  const { setTokenPrice } = useStore();


  function toggleBuysell(input: string) {
    setBuysell(input);
  }

  // NOTE: fetch price first
  // const tokenPrice = 1
  const { setFinalPriceWithDecimal } = useStore()

  // Read the allowance to check if the amount is already approved
  // Prepare the write contract for the approve function

  const { data: priceData, error: priceError } = useQuery({
    queryKey: ['price'],
    queryFn: fetchPrice,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (priceData) {
      setTokenPrice(priceData);
      setFinalPriceWithDecimal(RoundTwoPlaces(Number(USDTAmountToBuy) / priceData - (USDTAmountToBuy / priceData * 0.04)));
    }
  }, [priceData, USDTAmountToBuy]);


  useEffect(() => {
    if (priceError) {
      console.log("NO PRICE");
    }
  }, [priceError]);

  const [searchParams] = useSearchParams();
  const location = useLocation();
  return (
    <div>
      <section className="transactions">
        <div className="transaction-panel">
          <div className="panel-header">
            <button
              onClick={() => toggleBuysell('buy')}
              style={buysell === 'buy' ? { backgroundColor: "white", color: "black" } : { backgroundColor: "#26262f", color: "white" }} className="buy-button">Buy</button>
            {!(location.pathname === "/referral") ? <button
              onClick={() => toggleBuysell('sell')}
              style={buysell === 'sell' ? { backgroundColor: "white", color: "black" } : { backgroundColor: "#26262f", color: "white" }} className="refund-button">Sell</button> : ""}
            {!(location.pathname === "/referral") ? <button
              onClick={() => toggleBuysell('cancel')}
              style={buysell === 'cancel' ? { backgroundColor: "white", color: "black" } : { backgroundColor: "#26262f", color: "white" }} className="refund-button">Cancel</button> : ""}
          </div>
          <BuyFormComponent />
          {/* sell section */}
          <SellFormComponent />
          {/* cancel section */}
          <CancelFormComponent />

        </div>
      </section>
      {/*  */}

    </div>
  );
}

export default TransactionComponent;
