import Web3 from 'web3'
import BAPSaleContractABI from './BAPSaleContract.json'

export async function getChainId() {
  if (!window.ethereum) {
    return 0
  }

  const chainId = await window.ethereum.request({ method: 'eth_chainId' })
  return chainId
}

export async function getAccount() {
  if (!window.ethereum) {
    return null
  }

  const web3 = new Web3(window.ethereum)
  const accounts = await web3.eth.getAccounts()
  return accounts[0]
}

export async function getEthBalance() {
  if (!window.ethereum) {
    return 0
  }

  const web3 = new Web3(window.ethereum)
  const account = await getAccount()
  if (!account) {
    return 0
  }
  const balance = await web3.eth.getBalance(account)
  return web3.utils.fromWei(balance, 'ether')
}

export async function getERC20Balance(tokenAddress, ownerAddress) {
  if (!window.ethereum || tokenAddress === '') {
    return 0
  }
  const web3 = new Web3(window.ethereum)
  const ABI = [
    // balanceOf
    {
      constant: true,
      inputs: [{ name: 'account', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ name: 'balance', type: 'uint256' }],
      type: 'function',
    },
    // decimals
    {
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [{ name: '', type: 'uint8' }],
      type: 'function',
    },
  ]

  let contract = new web3.eth.Contract(ABI, tokenAddress)
  const account = await getAccount()
  if (!account) {
    return 0
  }
  const balance = await contract.methods
    .balanceOf(ownerAddress ? ownerAddress : account)
    .call()
  if (balance == '0') {
    return balance
  }
  const decimal = await contract.methods.decimals().call()
  const decimals = balance.substring(balance.length - decimal)
  return balance.substring(0, balance.length - decimal) + '.' + decimals
}

export async function getLatestPriceOf(feederAddress) {
  const aggregatorV3InterfaceABI = [
    {
      inputs: [],
      name: 'decimals',
      outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'description',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint80', name: '_roundId', type: 'uint80' }],
      name: 'getRoundData',
      outputs: [
        { internalType: 'uint80', name: 'roundId', type: 'uint80' },
        { internalType: 'int256', name: 'answer', type: 'int256' },
        { internalType: 'uint256', name: 'startedAt', type: 'uint256' },
        { internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
        { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'latestRoundData',
      outputs: [
        { internalType: 'uint80', name: 'roundId', type: 'uint80' },
        { internalType: 'int256', name: 'answer', type: 'int256' },
        { internalType: 'uint256', name: 'startedAt', type: 'uint256' },
        { internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
        { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'version',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
  ]

  const web3 = new Web3(process.env.REACT_APP_MAINNET_END_POINT)
  const priceFeed = new web3.eth.Contract(
    aggregatorV3InterfaceABI,
    feederAddress
  )

  const result = await priceFeed.methods.latestRoundData().call()
  return parseInt(result.answer) / Math.pow(10, 8)
}

export async function buyBapTokens(bapAmount, token, tokenAmount) {
  if (!window.ethereum) {
    return
  }

  if (token === '') {
    token = '0x0000000000000000000000000000000000000000'
  }

  const web3 = new Web3(window.ethereum)
  const bapSaleContract = new web3.eth.Contract(
    BAPSaleContractABI.abi,
    process.env.REACT_APP_BAPSALECONTRACT
  )
  const data = bapSaleContract.buy.getData()

  console.log(data)
}
