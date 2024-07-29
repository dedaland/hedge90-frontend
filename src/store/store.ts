import { create } from 'zustand';


interface State {
    tokenPrice: number;
    setTokenPrice: (price: number) => void;
    USDTAmountToBuy: number;
    setUSDTAmountToBuy: (amount: number) => void;
    finalPriceWithDecimal: number;
    setFinalPriceWithDecimal: (price: number) => void;
    isUSDTApproved: boolean;
    setIsUSDTApproved: (approved: boolean) => void;
    isUSDTApproveLoading: boolean;
    setIsUSDTApproveLoading: (loading: boolean) => void;
    DeDaAmountToSell: number;
    setDeDaAmountToSell: (amount: number) => void;
    DeDaIndexToSell: number;
    setDeDaIndexToSell: (index: number) => void;
    isDeDaApproved: boolean;
    setIsDeDaApproved: (approved: boolean) => void;
    isDeDaApproveLoading: boolean;
    setIsDeDaApproveLoading: (loading: boolean) => void;
    selectOptions: any[];
    setSelectOptions: (options: any[]) => void;
    loadingOptions: boolean;
    setLoadingOptions: (loading: boolean) => void;
    isConnected: boolean;
    setIsConnected: (connected: boolean) => void;
    handleBuyApprove: () => void;
    handleSellApprove: () => void;
    showLowBalance: boolean;
    setShowLowBalance: (show: boolean) => void;
    buysell: string;
    setBuysell: (option: string) => void;
}

const useStore = create<State>((set) => ({
    tokenPrice: 0,
    setTokenPrice: (price) => set({ tokenPrice: price }),
    USDTAmountToBuy: 50,
    setUSDTAmountToBuy: (amount) => set({ USDTAmountToBuy: amount }),
    finalPriceWithDecimal: 0,
    setFinalPriceWithDecimal: (price) => set({ finalPriceWithDecimal: price }),
    isUSDTApproved: false,
    setIsUSDTApproved: (approved) => set({ isUSDTApproved: approved }),
    isUSDTApproveLoading: false,
    setIsUSDTApproveLoading: (loading) => set({ isUSDTApproveLoading: loading }),
    DeDaAmountToSell: 0,
    setDeDaAmountToSell: (amount) => set({ DeDaAmountToSell: amount }),
    DeDaIndexToSell: 0,
    setDeDaIndexToSell: (index) => set({ DeDaIndexToSell: index }),
    isDeDaApproved: false,
    setIsDeDaApproved: (approved) => set({ isDeDaApproved: approved }),
    isDeDaApproveLoading: false,
    setIsDeDaApproveLoading: (loading) => set({ isDeDaApproveLoading: loading }),
    selectOptions: [],
    setSelectOptions: (options) => set({ selectOptions: options }),
    loadingOptions: true,
    setLoadingOptions: (loading) => set({ loadingOptions: loading }),
    isConnected: false,
    setIsConnected: (connected) => set({ isConnected: connected }),
    handleBuyApprove: () => set({ isUSDTApproveLoading: true }),
    handleSellApprove: () => set({ isDeDaApproveLoading: true }),
    showLowBalance: false,
    setShowLowBalance: (show) => set({ showLowBalance: show }),
    buysell: 'buy',
    setBuysell: (option) => set({ buysell: option })
}));

export default useStore