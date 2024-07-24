import { wagmiConfig as config } from '../../wallet-connect';
import { abi } from '../../constants/erc20_abi'
import { useState, useEffect, useReducer } from 'react';
import { getAccount, readContract } from '@wagmi/core'




function getBalance({address}: {address: string}){
  const account = getAccount(config)
  // console.log("getBalance", account)
  const result = readContract(config, {
    abi: abi,
    address: address as `0x${string}`,
    functionName: 'balanceOf',
    args: [account.address ?? '0x0000000000000000000000000000000000000000'],
  })
  return result.then((data) => {
      console.log("DATA1", data)
      return data
    }).catch((err)=>{
      console.log("ERR", err)
      return null;
    })
}


function LowBalanceTokenComponent({showLowBalance, lowBalanceFunc, name, address, userInput, decimal}:
    {showLowBalance: boolean,lowBalanceFunc:any, name: string, address: string, userInput: number, decimal: number }){
    const [balance, setBalance] = useState<bigint | null>(null);
    console.log("HERE", showLowBalance)
    useEffect(() => {
      getBalance({address}).then((data)=>{
        setBalance(data)
      })
      if(userInput && balance){
        console.log("BALANCE-EE", balance, userInput)
        if(balance < (userInput*(10**decimal))){
          lowBalanceFunc(true)
        }
        else{
          lowBalanceFunc(false)
        }
      }
  },[userInput])
    return (
      <div style={{display: showLowBalance?"block":"none"}}>
        <hr style={{borderBottom: "none",  borderColor: "gray"}} />
        <div style={{color: "red", textAlign:"right", fontSize:"0.8em"}}>not enough {name}</div>
      </div>
      )
  }


export {LowBalanceTokenComponent, getBalance};
