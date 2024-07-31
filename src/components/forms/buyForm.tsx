import { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from "react-router-dom";
import { type BaseError, useWriteContract, useSimulateContract, useReadContract, useAccount } from 'wagmi'
import { abi } from '../../erc20_abi'
import useStore from '../../store/store'
import {ReadUSDTBalanceContract} from '../tokenBalance'
import BuyTokensComponent from './../tokenBuy'
import {USDTAddress, contractAddress, MAX_TO_APPROVE} from '../../utils/constants'
import {RoundTwoPlaces} from '../../utils/functions'

function BuyFormComponent() {
    const {buysell} = useStore();
    const { isUSDTApproved, setIsUSDTApproved } = useStore();
    const { isUSDTApproveLoading, setIsUSDTApproveLoading } = useStore();
    const { isConnected, address } = useAccount();
  
  
  
    const { USDTAmountToBuy, setUSDTAmountToBuy } = useStore();
    const { tokenPrice, setTokenPrice } = useStore();
    const { finalPriceWithDecimal, setFinalPriceWithDecimal } = useStore()
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

  const [searchParams, setSearchParams] = useSearchParams();
  const [refCode, setRefCode] = useState("");
  const generateRefCode = () => {
    if (address) {
      setRefCode(window.location.origin + "?ref=" + address)
    } else { }
  }
  const location = useLocation();
    return (
    <div style={buysell === 'buy' ? { display: 'block' } : { display: 'none' }} className="sell-buy-section">
    <h5>Tether to pay</h5>
    <input type="text"
      value={USDTAmountToBuy === 0 ? "" : USDTAmountToBuy.toString()}
      onChange={(e) => {
        let value = Number(e.target.value);
        let finalPrice = RoundTwoPlaces((value / tokenPrice))
        if(location.pathname==="/hedge90"){
          finalPrice = RoundTwoPlaces((value / tokenPrice) - (value / tokenPrice * 0.04))
        }
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
    {searchParams.get('ref') ? 
    <div><h5>inviter: </h5><input type="text" value={searchParams.get('ref')?.toString()} placeholder='inviter' disabled /> </div>
    : ""}

    <div className='available-amount'>Available: {isConnected ?
      <ReadUSDTBalanceContract address={USDTAddress as `0x${string}`} decimal={18} />
      : "Connect your wallet"}
    </div>
    <p className='price-text'>&#9432; 1 DedaCoin = {tokenPrice !== 0 ? tokenPrice.toString() + ` Tether` : `Loading...`}</p>
    <div style={{ textAlign: "center", fontSize: "0.7em", paddingBottom: "10px" }}>The minimum purchase amount is set at 50 USDT.</div>
    {/* {searchParams.get('ref') ? <button onClick={generateRefCode} style={{ "backgroundColor": "rgb(61 216 216)", "border": "none", "borderRadius": "5px", "padding": "8px" }}>Generate ref code</button> : ""}
    <br />
    <br />
    <div style={{ textAlign: "center", fontSize: "10px" }}> <a target='_blank' style={{ color: "white" }} href={refCode}>{refCode} </a></div>
    <br /> */}
    {isUSDTApproved ? (
      <BuyTokensComponent />
    ) : (
      <button disabled={isUSDTApproveLoading} className="sell-button" onClick={handleBuyApprove}>{isUSDTApproveLoading ? "Processing..." : "Approve USDT"}</button>
    )}


  </div>)
  }
  

export default BuyFormComponent