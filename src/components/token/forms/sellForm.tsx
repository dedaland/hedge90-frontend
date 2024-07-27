import React, { useState } from 'react';
import Select from 'react-select';
import SellTokensComponent from '../sellToken'
import TokenApproval from '../tokenApproval'
import useStore from '../../../store/store'

const SellForm = () => {
  const [tokenBalanceLow, setTokenBalanceLow] = useState(false);
  const {
    DeDaIndexToSell,
    setDeDaIndexToSell,
    DeDaAmountToSell,
    setDeDaAmountToSell,
    isDeDaApproved,
    setIsDeDaApproved,
    selectOptions,
    tokenPrice
  } = useStore();

  const handleSelectChange = (selectedOption: any) => {
    if (selectedOption) {
      setDeDaIndexToSell(Number(selectedOption.value));
    }
  };

  return (
    <div>
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
      <input
        type="number"
        value={DeDaAmountToSell === 0 ? "" : DeDaAmountToSell.toString()}
        onChange={(e) => {
          const data = selectOptions.reduce((acc, option) => option.value == DeDaIndexToSell.toString() ? acc + (option.amount / 10 ** 8) : acc, 0);
          if (data >= Number(e.target.value)) {
            setDeDaAmountToSell(Number(e.target.value));
          } else {
            setDeDaAmountToSell(0);
          }
        }}
        placeholder="Amount"
      />
      <button
        className='max-button'
        onClick={() => {
          const data = selectOptions.reduce((acc, option) => option.value == DeDaIndexToSell.toString() ? acc + (option.amount / 10 ** 8) : acc, 0);
          setDeDaAmountToSell(data);
        }}
      >Max</button>
      <div className='available-amount'>
        Available: 
        {/* {isConnected ? <ReadTokenBalanceContract address={tokenAddress} decimal={8} userInput={DeDaAmountToSell} lowBalanceFunc={setTokenBalanceLow} /> : "Connect your wallet"} */}
      </div>
      <div>
        {/* {isConnected ? <LowBalanceTokenComponent showLowBalance={tokenBalanceLow} lowBalanceFunc={setTokenBalanceLow} name={"DedaCoin"} address={tokenAddress} userInput={DeDaAmountToSell} decimal={8} /> : ""} */}
      </div>
      <h5>Tether you receive</h5>
      <input
        type="text"
        value={DeDaAmountToSell === 0 ? "" : (Number(DeDaAmountToSell) * selectOptions.reduce((acc, option) => option.value == DeDaIndexToSell.toString() ? acc + (option.purshase_price / (10 ** 18) - (option.purshase_price / (10 ** 18) * 0.1) - (option.purshase_price / (10 ** 18) * 0.04)) : acc, 0)).toString()}
        placeholder="Amount"
        disabled
        />
        ⓘ 1 DedaCoin = {tokenPrice !== 0 ? tokenPrice.toString() +  `Tether` : `Loading...`}
        {isDeDaApproved ? (
        <SellTokensComponent />
        ) : (
        <TokenApproval
        tokenAddress={tokenAddress}
        abi={abi}
        userAddress={address}
        contractAddress={contractAddress}
        amount={DeDaAmountToSell}
        decimal={8}
        approveText="Approve DeDa"
        onSuccess={() => setIsDeDaApproved(true)}
        onError={() => setIsDeDaApproveLoading(false)}
        />
        )}
        </div>
  )}
        
  export default SellForm;