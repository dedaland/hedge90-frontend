import { useState } from 'react';
import { useLocation, useSearchParams } from "react-router-dom";
import { type BaseError, useWriteContract, useSimulateContract} from 'wagmi'
import { contract_abi } from '../contract_abi'
import InvoiceModal from './savableTnx'
import useStore from '../store/store'
import {contractAddress} from '../utils/constants'
import {RoundTwoPlaces} from '../utils/functions'


function BuyTokensComponent() {
    const [isLoading, setisLoading] = useState(false);
    const [isPurchased, setisPurchased] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tnxHash, setTnxHash] = useState("0x");
    const { USDTAmountToBuy, finalPriceWithDecimal } = useStore(); // RoundTwoPlaces
    // console.log("BUY AMOUNT", amountToBuy, amount)
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    console.log("LOC", location.pathname)
  
    const { data, error } = useSimulateContract({
      address: contractAddress as `0x${string}`,
      abi: contract_abi,
      functionName: (location.pathname==="/referral")?'normalBuy':'buyTokens',
      args: [BigInt(USDTAmountToBuy * (10 ** 18)), searchParams.get("ref")?searchParams.get("ref"):"0x0000000000000000000000000000000000000000"],
    });
    console.log("Buy Err", error?.message)
  
    const { writeContract } = useWriteContract()
  
    return (
      <div>
        <InvoiceModal isOpen={isModalOpen} amount={(Number(RoundTwoPlaces(finalPriceWithDecimal)))} tnxId={tnxHash} action='purchase' onClose={() => setIsModalOpen(false)} />
        {isPurchased ? (
          <button className="sell-button">Successfully purchased</button>
        ) :
          (<button disabled={isLoading} className="sell-button" onClick={() => {
            setisLoading(true)
            writeContract(
              data!.request, {
              onSuccess: (data) => {
                console.log("USDT APPROVE DATA", data)
  
                setTimeout(() => {
                  setisPurchased(true)
                  setisLoading(false);
                  setTnxHash(data)
                  setIsModalOpen(true)
                }, 15000)
  
              },
              onError: (error) => {
                console.log("ERROR", error)
                setisLoading(false);
              }
            }
            )
          }
          }>
            {isLoading ? "Processing..." : "Buy DedaCoin"}
          </button>)}
      </div>
    );
  }

  export default BuyTokensComponent;