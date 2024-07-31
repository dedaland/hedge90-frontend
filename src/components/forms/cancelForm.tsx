import { useState, useEffect } from 'react';
import useStore from '../../store/store'
import { getAccount } from '@wagmi/core'
import Select, { SingleValue } from 'react-select';
import { useAccount } from 'wagmi'
import { OptionType } from '../../utils/types'
import {customStyles, customTheme} from '../../utils/themeAndStyle'
import { wagmiConfig as config } from '../../wallet-connect';
import { formatOptionLabel } from '../../utils/functions'
import CancelTokensComponent from './../tokenCancel'

function CancelFormComponent() {

    const {buysell} = useStore();
    const { selectOptions } = useStore();
    const { tokenPrice } = useStore();
    const [loadingOptions] = useState(true);
    const { DeDaIndexToSell, setDeDaIndexToSell } = useStore();

    const handleSelectChange = (selectedOption: SingleValue<OptionType>) => {
        if (selectedOption) {
          setDeDaIndexToSell(Number(selectedOption.value));
        }
      };
    
    return (
        <div style={buysell === 'cancel' ? { display: 'block' } : { display: 'none' }} className="sell-buy-section">
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
            <hr style={{ borderBottom: "none", width: "95%" }} />
            <p className='price-text'>&#9432; 1 DedaCoin = {tokenPrice ? tokenPrice.toString() + ` Tether` : `Loading...`}</p>
            <CancelTokensComponent />

          </div>
    )
}

export default CancelFormComponent