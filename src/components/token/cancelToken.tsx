import { contract_abi } from '../../constants/contract_abi'
import InvoiceModal from './../modals/savableTnx'
import { useState, useEffect, useReducer } from 'react';
import { getAccount, readContract } from '@wagmi/core'
import { wagmiConfig as config } from '../../wallet-connect';
import { abi } from '../../constants/erc20_abi'
import { type BaseError, useWriteContract, useSimulateContract, useReadContract, useAccount } from 'wagmi'
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;


function CancelTokensComponent({ index }: { index: number }) {
    const [isLoading, setisLoading] = useState(false);
    const [isPurchased, setisPurchased] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tnxHash, setTnxHash] = useState("0x");
  
    const { data } = useSimulateContract({
      address: contractAddress as `0x${string}`,
      abi: contract_abi,
      functionName: 'cancelHedge90',
      args: [BigInt(index)],
    });
  
    const { writeContract } = useWriteContract()
  
    return (
      <div>
        <InvoiceModal isOpen={isModalOpen} amount={(Number(0)/10**8)} tnxId={tnxHash} action='return' onClose={() => setIsModalOpen(false)} />
        {isPurchased ? (
        <button className="sell-button">Successfully canceled</button>
       ) :
        (<button disabled={isLoading} className="sell-button" onClick={() => {
          setisLoading(true)
          writeContract(
            data!.request,{
              onSuccess: (data) => {
                setTimeout(() => {
                  setisPurchased(true)
                  setisLoading(false);
                  setTnxHash(data)
                  setIsModalOpen(true)
                }, 15000)
              
            },
            onError: () => {
              setisLoading(false);
            }
          }
      )
    }
    }>
          { isLoading ? "Processing..." : "Cancel Hedge90"}
        </button>)}
      </div>
    );
  }


export default CancelTokensComponent;