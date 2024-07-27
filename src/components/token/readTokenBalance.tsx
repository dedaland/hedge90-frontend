import React, { useState, useEffect } from 'react';
import { getAccount, readContract } from '@wagmi/core'
import { wagmiConfig as config } from '../../wallet-connect';
import { abi } from '../../constants/erc20_abi'


function getBalance(){
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

const  ReadTokenBalanceContract = ({address, decimal, lowBalanceFunc, userInput}: 
    {address: string, decimal: number, lowBalanceFunc:any, userInput: number}) => {
        const [balance, setBalance] = useState<bigint | null>(null);

        useEffect(() => {
        getBalance({address}).then((data: any)=>{
        setBalance(data)
        })
        },[address])


        if(balance && userInput){
        console.log("HERER", balance, userInput)
        if(balance < (userInput*(10**decimal))){
        lowBalanceFunc(true)
        }
        else{
        lowBalanceFunc(false)
        }
        }


        // if (isLoading) {
        //   return "Loading..."
        // }

        // if (isError) {
        //   console.log("ERR", "Couldn't fetch balance", error)
        //   return ""
        // }
        if(typeof balance === "bigint"){
        // lowBalanceFunc((Number(balance)/(10**decimal)) < 50);
        return (
        <div style={{display:"inline"}}>
        {(Number(balance)/(10**decimal)).toString()}
        </div>
        )
        }else{
        return "Couldn't fetch balance"
        }
}

export default ReadTokenBalanceContract