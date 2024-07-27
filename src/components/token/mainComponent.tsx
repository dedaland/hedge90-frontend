import React, { useEffect, useState } from 'react';
import TransactionPanel from './transactionPanel';
import {customStyles, customTheme, formatOptionLabel, type OptionType} from '../theme/selectTheme';


const MainComponent = () => {

  useEffect(() => {
    // Fetch initial data such as tokenPrice, selectOptions, etc.
  }, []);

  return (
    <TransactionPanel/>
  );
};

export default MainComponent;