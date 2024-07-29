import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { type BaseError, useWriteContract, useSimulateContract, useReadContract, useAccount } from 'wagmi'
import Select, { SingleValue } from 'react-select';
import { abi } from '../erc20_abi'
import { getAccount } from '@wagmi/core'
import { wagmiConfig as config } from '../wallet-connect';
import useStore from '../store/store'
import {ReadUSDTBalanceContract, ReadDeDaBalanceContract} from './tokenBalance'
import BuyTokensComponent from './tokenBuy'
import SellTokensComponent from './tokenSell'
import CancelTokensComponent from './tokenCancel'
import {USDTAddress, tokenAddress, contractAddress, MAX_TO_APPROVE} from '../utils/constants'
import {RoundTwoPlaces} from '../utils/functions'
import {fetchPrice, fetchUserPurchases} from '../utils/fetch'
import {OptionType} from '../utils/types'
import {customStyles, customTheme} from '../utils/themeAndStyle'


function TransactionComponent() {
  const { isUSDTApproved, setIsUSDTApproved } = useStore();
  const { isUSDTApproveLoading, setIsUSDTApproveLoading } = useStore();


  const { isDeDaApproved, setIsDeDaApproved } = useStore();
  const { isDeDaApproveLoading, setIsDeDaApproveLoading } = useStore();
  // 
  const [buysell, setBuysell] = useState('buy');
  const { isConnected, address } = useAccount();



  const { USDTAmountToBuy, setUSDTAmountToBuy } = useStore();
  const { DeDaAmountToSell, setDeDaAmountToSell } = useStore();
  const { DeDaIndexToSell, setDeDaIndexToSell } = useStore()
  const { tokenPrice, setTokenPrice } = useStore();


  const formatOptionLabel = ({ label1, imageUrl1, label2, imageUrl2 }: OptionType) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={imageUrl1} alt="" style={{ marginRight: "10px", width: "20px", height: "20px" }} />
        <span>{label1}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span>{label2}</span>
        <img src={imageUrl2} alt="" style={{ marginLeft: "10px", width: "20px", height: "20px" }} />
      </div>
    </div>
  );



  function toggleBuysell(input: string) {
    setBuysell(input);
  }

  // 
  const USDTAmountToBuyWithDecimal = USDTAmountToBuy * (10 ** 18)
  const DeDaAmountToSellWithDecimal = DeDaAmountToSell * (10 ** 8)
  // NOTE: fetch price first
  // const tokenPrice = 1
  const { finalPriceWithDecimal, setFinalPriceWithDecimal } = useStore()

  // Read the allowance to check if the amount is already approved
  const { data: usdtAllowance } = useReadContract({
    address: USDTAddress as `0x${string}`,
    abi: abi,
    functionName: 'allowance',
    args: [address ?? '0x0000000000000000000000000000000000000000', contractAddress as `0x${string}`],
  });

  function checkUSDTApproval(value: number) {
    if (usdtAllowance && usdtAllowance >= (value * (10 ** 18))) {
      setIsUSDTApproved(true);
    } else {
      setIsUSDTApproved(false);
    }
  }

  const { data: dedaAllowance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: abi,
    functionName: 'allowance',
    args: [address ?? '0x0000000000000000000000000000000000000000', contractAddress as `0x${string}`],
  });


  useEffect(() => {
    if (usdtAllowance && usdtAllowance >= USDTAmountToBuyWithDecimal) {
      setIsUSDTApproved(true);
    } else {
      setIsUSDTApproved(false);
    }
  }, [usdtAllowance]);



  // Prepare the write contract for the approve function
  const { data: buyData, error: buyErr } = useSimulateContract({
    address: USDTAddress as `0x${string}`,
    abi: abi,
    functionName: 'approve',
    args: [contractAddress as `0x${string}`, MAX_TO_APPROVE],
  });

  const { writeContract: writeUSDTApproveContract } = useWriteContract()

  useEffect(() => {
    if (buyErr) {
      console.error("Failed to simulate contract approval.", buyErr);
    }
  }, [buyErr]);

  const handleBuyApprove = () => {
    let amountToUse = USDTAmountToBuy;
    if (amountToUse < 50n) {
      alert("Minimum USDT is 50!")
    }
    if (!buyData || !buyData.request) {
      console.error("Approval simulation data is not available.", buyErr);
      return;

    }
    setIsUSDTApproveLoading(true)
    writeUSDTApproveContract(
      buyData.request, {
      onSuccess: () => {
        setTimeout(() => {
          setIsUSDTApproved(true)
          setIsUSDTApproveLoading(false);
        }, 15000)
      },
      onError: () => {
        setIsUSDTApproveLoading(false);
      }
    }
    )
  }

  useEffect(() => {
    if (dedaAllowance && dedaAllowance >= DeDaAmountToSellWithDecimal) {
      setIsDeDaApproved(true);
    } else {
      setIsDeDaApproved(false);
    }
  }, [dedaAllowance])
  function checkDEDAApproval(value: number) {
    if (dedaAllowance && dedaAllowance >= (value * (10 ** 8))) {
      setIsDeDaApproved(true);
    } else {
      setIsDeDaApproved(false);
    }
  }

  const { data: sellData, error: sellErr } = useSimulateContract({
    address: tokenAddress as `0x${string}`,
    abi: abi,
    functionName: 'approve',
    args: [contractAddress as `0x${string}`, MAX_TO_APPROVE],
  });

  useEffect(() => {
    if (sellErr) {
      console.error("Failed to simulate contract sell.", sellErr);
    }
  }, [sellErr]);

  const { writeContract: writeDeDaApproveContract } = useWriteContract()

  const handleSellApprove = () => {
    if (!sellData || !sellData.request) {
      console.error("Approval simulation data is not available.");
      return;

    }
    setIsDeDaApproveLoading(true)
    writeDeDaApproveContract(
      sellData.request, {
      onSuccess: () => {
        setTimeout(() => {
          setIsDeDaApproved(true)
          setIsDeDaApproveLoading(false);
        }, 15000)
      },
      onError: () => {
        setIsDeDaApproveLoading(false);
      }
    }
    )
  }

  const handleSelectChange = (selectedOption: SingleValue<OptionType>) => {
    if (selectedOption) {
      setDeDaIndexToSell(Number(selectedOption.value));
    }
  };


  const { selectOptions, setSelectOptions } = useStore()
  const [loadingOptions, setLoadingOptions] = useState(true);
  const account = getAccount(config)

  const { data: priceData, error: priceError } = useQuery({
    queryKey: ['price'],
    queryFn: fetchPrice,
    refetchInterval: 5000,
  });

  const { data: userPurchasesData, error: userPurchasesError } = useQuery({
    queryKey: ['userPurchases', account.address],
    queryFn: () => fetchUserPurchases(account.address ? account.address : ""),
    refetchInterval: 5000,
    enabled: !!account.address
  });

  useEffect(() => {
    if (priceData) {
      setTokenPrice(priceData);
      setFinalPriceWithDecimal(RoundTwoPlaces(Number(USDTAmountToBuy) / priceData - (USDTAmountToBuy / priceData * 0.04)));
    }
  }, [priceData, USDTAmountToBuy]);

  useEffect(() => {
    if (userPurchasesData) {
      setSelectOptions(userPurchasesData);
      setLoadingOptions(false);
    }
  }, [userPurchasesData]);

  useEffect(() => {
    if (priceError) {
      console.log("NO PRICE");
    }
    if (userPurchasesError) {
      console.log("NO USER PURCHASES");
      setLoadingOptions(false);
    }
  }, [priceError, userPurchasesError]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [refCode, setRefCode] = useState("");
  const generateRefCode = () => {
    if (address) {
      setRefCode(window.location.origin + "?ref=" + address)
    } else { }
  }
  return (
    <div>
      <section className="transactions">
        <div className="transaction-panel">
          <div className="panel-header">
            <button
              onClick={() => toggleBuysell('buy')}
              style={buysell === 'buy' ? { backgroundColor: "white", color: "black" } : { backgroundColor: "#26262f", color: "white" }} className="buy-button">Buy</button>
            {!searchParams.get('ref') ? <button
              onClick={() => toggleBuysell('sell')}
              style={buysell === 'sell' ? { backgroundColor: "white", color: "black" } : { backgroundColor: "#26262f", color: "white" }} className="refund-button">Sell</button> : ""}
            {!searchParams.get('ref') ? <button
              onClick={() => toggleBuysell('cancel')}
              style={buysell === 'cancel' ? { backgroundColor: "white", color: "black" } : { backgroundColor: "#26262f", color: "white" }} className="refund-button">Cancel</button> : ""}
          </div>
          {/* buy section */}

          <div style={buysell === 'buy' ? { display: 'block' } : { display: 'none' }} className="sell-buy-section">
            <h5>Tether to pay</h5>
            <input type="text"
              value={USDTAmountToBuy === 0 ? "" : USDTAmountToBuy.toString()}
              onChange={(e) => {
                let value = Number(e.target.value);
                let finalPrice = RoundTwoPlaces((value / tokenPrice) - (value / tokenPrice * 0.04))
                console.log("finalPrice", finalPrice);
                setUSDTAmountToBuy(value);
                setFinalPriceWithDecimal(finalPrice);
                checkUSDTApproval(value)

              }}
              onBlur={(e) => {
                let value = Number(e.target.value);
                if (value < 50) {
                  setUSDTAmountToBuy(50);
                }
              }}
              placeholder="Amount" />
            <h5>DedaCoin you recieve</h5>
            <input type="string"
              value={finalPriceWithDecimal == 0 ? "" : RoundTwoPlaces(finalPriceWithDecimal).toString()}
              placeholder="Amount" disabled />
            <h5>inviter: </h5>
            {searchParams.get('ref') ? <input type="text" value={searchParams.get('ref')?.toString()} placeholder='inviter' disabled /> : ""}

            <div className='available-amount'>Available: {isConnected ?
              <ReadUSDTBalanceContract address={USDTAddress as `0x${string}`} decimal={18} />
              : "Connect your wallet"}
            </div>
            <p className='price-text'>&#9432; 1 DedaCoin = {tokenPrice !== 0 ? tokenPrice.toString() + ` Tether` : `Loading...`}</p>
            <div style={{ textAlign: "center", fontSize: "0.7em", paddingBottom: "10px" }}>The minimum purchase amount is set at 50 USDT.</div>
            {searchParams.get('ref') ? <button onClick={generateRefCode} style={{ "backgroundColor": "#788181", "border": "none", "borderRadius": "5px", "padding": "8px" }}>Generate ref code</button> : ""}
            <br />
            <br />
            <div style={{ fontSize: "10px" }}> <a target='_blank' style={{ color: "green" }} href={refCode}>{refCode} </a></div>
            <br />
            {isUSDTApproved ? (
              <BuyTokensComponent />
            ) : (
              <button disabled={isUSDTApproveLoading} className="sell-button" onClick={handleBuyApprove}>{isUSDTApproveLoading ? "Processing..." : "Approve USDT"}</button>
            )}


          </div>
          {/* sell section */}
          <div style={buysell === 'sell' ? { display: 'block' } : { display: 'none' }} className="sell-buy-section">
            <div className="previous-purchases">
              <h3> <img width="15px" src="/time-past-svgrepo-com.svg" alt="" /> Previous Purchases</h3>
              <Select
                isLoading={loadingOptions}
                options={selectOptions}
                styles={customStyles}
                theme={customTheme}
                formatOptionLabel={formatOptionLabel}
                value={selectOptions.find(option => option.value === DeDaIndexToSell.toString())}
                onChange={handleSelectChange}
              />

            </div>
            <h5>DedaCoin to pay</h5>
            <input type="number"
              value={DeDaAmountToSell === 0 ? "" : DeDaAmountToSell.toString()}
              onChange={
                (e) => {
                  const data = selectOptions.reduce((acc, option) => option.value == DeDaIndexToSell.toString() ? acc + (option.amount / 10 ** 8)! : acc, 0)
                  const value = Number(e.target.value);
                  if (data >= value) {
                    setDeDaAmountToSell(Number(e.target.value))
                  }
                  else {
                    setDeDaAmountToSell(0)
                  }
                  checkDEDAApproval(value)
                }
              }
              placeholder="Amount" />
            <button className='max-button'
              onClick={() => {
                const data = selectOptions.reduce((acc, option) => option.value == DeDaIndexToSell.toString() ? acc + (option.amount / 10 ** 8)! : acc, 0)
                setDeDaAmountToSell(data)
              }}
            >Max</button>
            <div className='available-amount'>Available: {isConnected ? <ReadDeDaBalanceContract address={tokenAddress as `0x${string}`} decimal={8} /> : "Connect your wallet"}</div>
            <h5>Tether you receive</h5>
            <input type="text"
              value={DeDaAmountToSell === 0 ? "" : (Number(DeDaAmountToSell) * selectOptions.reduce((acc, option) => option.value == DeDaIndexToSell.toString() ? acc + (option.purshase_price / (10 ** 18) - (option.purshase_price / (10 ** 18) * 0.1) - (option.purshase_price / (10 ** 18) * 0.04))! : acc, 0)).toString()}
              placeholder="Amount" disabled />
            <p className='price-text'>&#9432; 1 DedaCoin = {tokenPrice ? tokenPrice.toString() + ` Tether` : `Loading...`}</p>
            {isDeDaApproved ? (
              <SellTokensComponent />
            ) : (
              <button disabled={isDeDaApproveLoading} className="sell-button" onClick={handleSellApprove}>{isDeDaApproveLoading ? "Processing..." : "Approve Dedacoin"}</button>
            )}
          </div>
          {/* cancel section */}
          <div style={buysell === 'cancel' ? { display: 'block' } : { display: 'none' }} className="sell-buy-section">
            <div className="previous-purchases">
              <h3> <img width="15px" src="/time-past-svgrepo-com.svg" alt="" /> Previous Purchases</h3>
              <Select
                isLoading={loadingOptions}
                options={selectOptions}
                styles={customStyles}
                theme={customTheme}
                formatOptionLabel={formatOptionLabel}
                value={selectOptions.find(option => option.value === DeDaIndexToSell.toString())}
                onChange={handleSelectChange}
              />

            </div>
            <hr style={{ borderBottom: "none", width: "95%" }} />
            <p className='price-text'>&#9432; 1 DedaCoin = {tokenPrice ? tokenPrice.toString() + ` Tether` : `Loading...`}</p>
            <CancelTokensComponent />

          </div>

        </div>
      </section>
      {/*  */}

    </div>
  );
}

export default TransactionComponent;
