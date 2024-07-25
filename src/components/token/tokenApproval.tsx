import React, { useState, useEffect } from 'react';
import { type BaseError, useWriteContract, useSimulateContract, useReadContract } from 'wagmi'

const TokenApproval = ({ tokenAddress, abi, userAddress, contractAddress, amount, decimal, approveText, onSuccess, onError }:
    {tokenAddress: `0x${string}` | undefined, abi: any, userAddress: string,contractAddress:string, amount: number, decimal: number, approveText: string, onSuccess: any, onError: any}
) => {
  const [isApproved, setIsApproved] = useState(false);
  const [isApproveLoading, setIsApproveLoading] = useState(false);

  const amountWithDecimal = amount * (10 ** decimal);
  const { data: allowance } = useReadContract({
    address: tokenAddress,
    abi,
    functionName: 'allowance',
    args: [userAddress, contractAddress],
  });

  useEffect(() => {
    const allowanceNumber = allowance ? Number(allowance) : 0;
    if (allowanceNumber >= amountWithDecimal) {
      setIsApproved(true);
    } else {
      setIsApproved(false);
    }
  }, [allowance, amount, amountWithDecimal]);

  const { data: approvalData, error: approvalError } = useSimulateContract({
    address: tokenAddress,
    abi,
    functionName: 'approve',
    args: [contractAddress, amountWithDecimal],
  });

  useEffect(() => {
    if (approvalError) {
      console.error("Failed to simulate contract approval.", approvalError);
    }
  }, [approvalError]);

  const { writeContract: writeApproveContract } = useWriteContract();

  const handleApprove = () => {
    if (!approvalData || !approvalData.request) {
      console.error("Approval simulation data is not available.", approvalError);
      return;
    }
    setIsApproveLoading(true);
    writeApproveContract(approvalData.request, {
      onSuccess: () => {
        setTimeout(() => {
          setIsApproved(true);
          setIsApproveLoading(false);
          onSuccess();
        }, 15000);
      },
      onError: () => {
        setIsApproveLoading(false);
        onError();
      }
    });
  };

  return (
    <button disabled={isApproveLoading} onClick={handleApprove}>
      {isApproveLoading ? "Processing..." : approveText}
    </button>
  );
};

export default TokenApproval;