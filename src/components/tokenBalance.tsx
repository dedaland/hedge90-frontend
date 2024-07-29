import { useState, useEffect } from 'react';
import { abi } from '../erc20_abi'
import { getAccount, readContract } from '@wagmi/core'
import { wagmiConfig as config } from '../wallet-connect';
import useStore from '../store/store'


function getBalance({ address }: { address: string }) {
    const account = getAccount(config)
    const result = readContract(config, {
      abi: abi,
      address: address as `0x${string}`,
      functionName: 'balanceOf',
      args: [account.address ?? '0x0000000000000000000000000000000000000000'],
    })
    return result.then((data) => {
      console.log("DATA1", data)
      return data
    }).catch((err) => {
      console.log("ERR", err)
      return null;
    })
  }
  
  
  function ReadUSDTBalanceContract({ address, decimal }: { address: string, decimal: number }) {
    const [balance, setBalance] = useState<bigint | null>(null);
    const { USDTAmountToBuy, setShowLowBalance, showLowBalance, DeDaAmountToSell } = useStore();
    useEffect(() => {
      getBalance({ address }).then((data) => {
        setBalance(data)
        if (data && data < (USDTAmountToBuy * (10 ** decimal))) {
          setShowLowBalance(true)
          console.log("HERE IN USDT looooooow1", showLowBalance)
        }
        else {
          setShowLowBalance(false)
          console.log("HERE IN USDT looooooow2", showLowBalance)
  
        }
      })
    }, [address, USDTAmountToBuy])
    if (typeof balance === "bigint") {
      return (
        <div style={{ display: "inline" }}>
          <div style={{ display: "inline" }}>
            {(Number(balance) / (10 ** decimal)).toString()}
          </div>
          <div style={{ display: showLowBalance ? "block" : "none" }}>
            <hr style={{ borderBottom: "none", borderColor: "gray" }} />
            <div style={{ color: "red", textAlign: "right", fontSize: "0.8em" }}>not enough USDT</div>
          </div>
        </div>
      )
    } else {
      return "Couldn't fetch balance"
    }
  }
  
  function ReadDeDaBalanceContract({ address, decimal }: { address: string, decimal: number }) {
    const [balance, setBalance] = useState<bigint | null>(null);
    const { setShowLowBalance, showLowBalance, DeDaAmountToSell } = useStore();
    let showLowBalanceLocal = false
    useEffect(() => {
      getBalance({ address }).then((data) => {
        setBalance(data)
        if (data && data < (DeDaAmountToSell * (10 ** decimal))) {
          setShowLowBalance(true)
          showLowBalanceLocal = true
        }
        else {
          setShowLowBalance(false)
  
        }
      })
    }, [address, DeDaAmountToSell])
    if (typeof balance === "bigint") {
      return (
        <div style={{ display: "inline" }}>
          <div style={{ display: "inline" }}>
            {(Number(balance) / (10 ** decimal)).toString()}
          </div>
          <div style={{ display: showLowBalance ? "block" : "none" }}>
            <hr style={{ borderBottom: "none", borderColor: "gray" }} />
            <div style={{ color: "red", textAlign: "right", fontSize: "0.8em" }}>not enough DedaCoin</div>
          </div>
        </div>
      )
    } else {
      return "Couldn't fetch balance"
    }
  }

  export { ReadUSDTBalanceContract, ReadDeDaBalanceContract }