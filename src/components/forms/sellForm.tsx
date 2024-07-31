
import { useState, useEffect } from 'react';
import SellTokensComponent from './../tokenSell'
import Select, { SingleValue } from 'react-select';
import { abi } from '../../erc20_abi'
import useStore from '../../store/store'
import { useQuery } from '@tanstack/react-query';
import { OptionType } from '../../utils/types'
import { getAccount } from '@wagmi/core'
import { wagmiConfig as config } from '../../wallet-connect';
import {customStyles, customTheme} from '../../utils/themeAndStyle'
import { formatOptionLabel } from '../../utils/functions'
import {tokenAddress, contractAddress, MAX_TO_APPROVE} from '../../utils/constants'
import { type BaseError, useWriteContract, useSimulateContract, useReadContract, useAccount } from 'wagmi'
import { ReadDeDaBalanceContract } from '../tokenBalance'
import {fetchUserPurchases} from '../../utils/fetch'


function SellFormComponent() {
    const {buysell} = useStore();
    const { isDeDaApproved, isDeDaApproveLoading, setIsDeDaApproveLoading, setIsDeDaApproved } = useStore();
    const { selectOptions, setSelectOptions } = useStore();
    const { isConnected, address } = useAccount();
  
    const { DeDaAmountToSell, DeDaIndexToSell, setDeDaAmountToSell, setDeDaIndexToSell } = useStore();
    const { tokenPrice,setTokenPrice } = useStore();
    const [loadingOptions, setLoadingOptions] = useState(true);
    const account = getAccount(config)
    const DeDaAmountToSellWithDecimal = DeDaAmountToSell * (10 ** 8)


    const handleSelectChange = (selectedOption: SingleValue<OptionType>) => {
        if (selectedOption) {
          setDeDaIndexToSell(Number(selectedOption.value));
        }
      };

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
    
    const { data: dedaAllowance } = useReadContract({
        address: tokenAddress as `0x${string}`,
        abi: abi,
        functionName: 'allowance',
        args: [address ?? '0x0000000000000000000000000000000000000000', contractAddress as `0x${string}`],
    });
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
    

  const { data: userPurchasesData, error: userPurchasesError } = useQuery({
    queryKey: ['userPurchases', account.address],
    queryFn: () => fetchUserPurchases(account.address ? account.address : ""),
    refetchInterval: 5000,
    enabled: !!account.address
  });

  useEffect(() => {
    if (userPurchasesData) {
      setSelectOptions(userPurchasesData);
      setLoadingOptions(false);
    }
  }, [userPurchasesData]);

  useEffect(() => {
    if (userPurchasesError) {
      console.log("NO USER PURCHASES");
      setLoadingOptions(false);
    }
  }, [userPurchasesError]);

    return (
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
    )
}

export default SellFormComponent