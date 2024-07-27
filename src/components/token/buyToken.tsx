import { contract_abi } from '../../constants/contract_abi'
import InvoiceModal from './../modals/savableTnx'
import { useState, useEffect, useReducer } from 'react';
import { getAccount, readContract } from '@wagmi/core'
import { wagmiConfig as config } from '../../wallet-connect';
import { abi } from '../../constants/erc20_abi'
import { type BaseError, useWriteContract, useSimulateContract, useReadContract, useAccount } from 'wagmi'
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;



function BuyTokensComponent() {
    const [isLoading, setisLoading] = useState(false);
    const [isPurchased, setisPurchased] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tnxHash, setTnxHash] = useState("0x");
    const amount = BigInt(amountToBuy);
    // console.log("BUY AMOUNT", amountToBuy, amount)
  
    const { data, error } = useSimulateContract({
      address: contractAddress as `0x${string}`,
      abi: contract_abi,
      functionName: 'buyTokens',
      args: [amount],
    });
    console.log("buytoken error", error?.message)
  
    const { writeContract } = useWriteContract()
  
    return (
      <div>
          <InvoiceModal isOpen={isModalOpen} amount={(Number(dedaAmount))} tnxId={tnxHash} action='purchase' onClose={() => setIsModalOpen(false)} />
        {isPurchased ? (
        <button className="sell-button">Successfully purchased</button>
       ) :
        (<button disabled={isLoading} className="sell-button" onClick={() => {
          setisLoading(true)
          writeContract(
            data!.request,{
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
          { isLoading ? "Processing..." : "Buy DedaCoin"}
        </button>)}
      </div>
    );
  }


export default BuyTokensComponent;