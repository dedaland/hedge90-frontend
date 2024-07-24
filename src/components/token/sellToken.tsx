// import { contract_abi } from '../../constants/contract_abi'
// import InvoiceModal from './../modals/savableTnx'
// import { useState, useEffect, useReducer } from 'react';
// import { getAccount, readContract } from '@wagmi/core'
// import { wagmiConfig as config } from '../../wallet-connect';
// import { abi } from '../../constants/erc20_abi'
// import { type BaseError, useWriteContract, useSimulateContract, useReadContract, useAccount } from 'wagmi'
// import { isUnparsedPrepend } from 'typescript';
// const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

// function SellTokensComponent({ amountToSell, index }: { amountToSell: number, index: number }) {
//     const [isLoading, setisLoading] = useState(false);
//     const [isPurchased, setisPurchased] = useState(false);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [tnxHash, setTnxHash] = useState("0x");
  
//     const { data } = useSimulateContract({
//       address: contractAddress as `0x${string}`,
//       abi: contract_abi,
//       functionName: 'returnTokens',
//       args: [BigInt(amountToSell), BigInt(index)],
//     });
  
//     const { writeContract } = useWriteContract()
  
//     return (
//       <div>
//         <InvoiceModal isOpen={isModalOpen} amount={(Number(amountToSell)/10**8)} tnxId={tnxHash} action='return' onClose={() => setIsModalOpen(false)} />
//         {isPurchased ? (
//         <button className="sell-button">Successfully returned</button>
//        ) :
//         (<button disabled={isLoading} className="sell-button" onClick={() => {
//           setisLoading(true)
//           writeContract(
//             data!.request,{
//               onSuccess: (data) => {
//                 setTimeout(() => {
//                   setisPurchased(true)
//                   setisLoading(false);
//                   setTnxHash(data)
//                   setIsModalOpen(true)
//                 }, 15000)
              
//             },
//             onError: () => {
//               setisLoading(false);
//             }
//           }
//       )
//     }
//     }>
//           { isLoading ? "Processing..." : "Sell DedaCoin"}
//         </button>)}
//       </div>
//     );
//   }


// export default SellTokensComponent;

import { contract_abi } from '../../constants/contract_abi'
import InvoiceModal from './../modals/savableTnx'
import { useEffect, useReducer } from 'react';
import { getAccount, readContract } from '@wagmi/core'
import { wagmiConfig as config } from '../../wallet-connect';
import { abi } from '../../constants/erc20_abi'
import { type BaseError, useWriteContract, useSimulateContract, useReadContract, useAccount } from 'wagmi'
import { isUnparsedPrepend } from 'typescript';
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

const initialState = {
  isLoading: false,
  isPurchased: false,
  isModalOpen: false,
  tnxHash: "0x",
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_PURCHASED':
      return { ...state, isPurchased: action.payload };
    case 'SET_MODAL_OPEN':
      return { ...state, isModalOpen: action.payload };
    case 'SET_TNX_HASH':
      return { ...state, tnxHash: action.payload };
    default:
      return state;
  }
}

function SellTokensComponent({ amountToSell, index }: { amountToSell: number, index: number }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { data } = useSimulateContract({
    address: contractAddress as `0x${string}`,
    abi: contract_abi,
    functionName: 'returnTokens',
    args: [BigInt(amountToSell), BigInt(index)],
  });

  const { writeContract } = useWriteContract();

  return (
    <div>
      <InvoiceModal
        isOpen={state.isModalOpen}
        amount={(Number(amountToSell) / 10 ** 8)}
        tnxId={state.tnxHash}
        action='return'
        onClose={() => dispatch({ type: 'SET_MODAL_OPEN', payload: false })}
      />
      {state.isPurchased ? (
        <button className="sell-button">Successfully returned</button>
      ) : (
        <button
          disabled={state.isLoading}
          className="sell-button"
          onClick={() => {
            dispatch({ type: 'SET_LOADING', payload: true });
            writeContract(
              data!.request, {
                onSuccess: (data) => {
                  setTimeout(() => {
                    dispatch({ type: 'SET_PURCHASED', payload: true });
                    dispatch({ type: 'SET_LOADING', payload: false });
                    dispatch({ type: 'SET_TNX_HASH', payload: data });
                    dispatch({ type: 'SET_MODAL_OPEN', payload: true });
                  }, 15000);
                },
                onError: () => {
                  dispatch({ type: 'SET_LOADING', payload: false });
                }
              }
            );
          }}
        >
          {state.isLoading ? "Processing..." : "Sell DedaCoin"}
        </button>
      )}
    </div>
  );
}

export default SellTokensComponent;