import { useState } from 'react';
import {useWriteContract, useSimulateContract} from 'wagmi'
import { contract_abi } from '../contract_abi'
import InvoiceModal from './savableTnx'
import useStore from '../store/store'
import {contractAddress} from '../utils/constants'

function CancelTokensComponent() {
    const [isLoading, setisLoading] = useState(false);
    const [isPurchased, setisPurchased] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tnxHash, setTnxHash] = useState("0x");
    const { DeDaIndexToSell } = useStore()
  
    const { data, error } = useSimulateContract({
      address: contractAddress as `0x${string}`,
      abi: contract_abi,
      functionName: 'cancelHedge90',
      args: [BigInt(DeDaIndexToSell)],
    });
    console.log("Cancel Err", error?.message)
  
    const { writeContract } = useWriteContract()
  
    return (
      <div>
        <InvoiceModal isOpen={isModalOpen} amount={(Number(0) / 10 ** 8)} tnxId={tnxHash} action='return' onClose={() => setIsModalOpen(false)} />
        {isPurchased ? (
          <button className="sell-button">Successfully canceled</button>
        ) :
          (<button disabled={isLoading} className="sell-button" onClick={() => {
            setisLoading(true)
            writeContract(
              data!.request, {
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
            {isLoading ? "Processing..." : "Cancel Hedge90"}
          </button>)}
      </div>
    );
  }
  

export default CancelTokensComponent