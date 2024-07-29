const USDTAddress = process.env.REACT_APP_USDT_ADDRESS;
const tokenAddress = process.env.REACT_APP_TOKEN_ADDRESS;

// Address of the contract to spend the tokens
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const MAX_TO_APPROVE = 115792089237316195423570985008687907853269984665640564039457584007913129639935n

export {
    USDTAddress,
    tokenAddress,
    contractAddress,
    MAX_TO_APPROVE
}