import React, { useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import { useReadContract, useSimulateContract, useWriteContract } from 'wagmi';
import { type OptionType, customStyles, customTheme, formatOptionLabel } from '../../theme/selectTheme';

interface CancelFormProps {
  tokenAddress: string;
  abi: any;
  userAddress: string;
  contractAddress: string;
  selectOptions: OptionType[];
}

const CancelForm: React.FC<CancelFormProps> = ({ tokenAddress, abi, userAddress, contractAddress, selectOptions }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(1);
  const [isCancelLoading, setIsCancelLoading] = useState(false);

  const handleSelectChange = (selectedOption: SingleValue<OptionType>) => {
    if (selectedOption) {
      setSelectedIndex(Number(selectedOption.value));
    }
  };

  const { data: cancelData, error: cancelError } = useSimulateContract({
    address: tokenAddress as `0x${string}`,
    abi: abi,
    functionName: 'cancel',
    args: [selectedIndex],
  });

  useEffect(() => {
    if (cancelError) {
      console.error("Failed to simulate contract cancel.", cancelError);
    }
  }, [cancelError]);

  const { writeContract: writeCancelContract } = useWriteContract();

  const handleCancel = () => {
    if (selectedIndex === null) {
      alert("Please select an option to cancel.");
      return;
    }
    if (!cancelData || !cancelData.request) {
      console.error("Cancel simulation data is not available.");
      return;
    }
    setIsCancelLoading(true);
    writeCancelContract(
      cancelData.request,
      {
        onSuccess: () => {
          setTimeout(() => {
            setIsCancelLoading(false);
          }, 15000);
        },
        onError: () => {
          setIsCancelLoading(false);
        }
      }
    );
  };

  return (
    <div>
      <h3>Previous Purchases</h3>
      <Select
        options={selectOptions}
        styles={customStyles}
        theme={customTheme}
        formatOptionLabel={formatOptionLabel}
        value={selectOptions.find(option => option.value === selectedIndex?.toString())}
        onChange={handleSelectChange}
      />
      <button disabled={isCancelLoading} onClick={handleCancel}>
        {isCancelLoading ? "Processing..." : "Cancel Token"}
      </button>
    </div>
  );
};

export default CancelForm;