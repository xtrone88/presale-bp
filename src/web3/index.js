import Web3 from 'web3'
import BAPSaleContractABI from './BAPSaleContract.json'

const BN = Web3.utils.BN

export async function getChainId() {
  if (!window.web3Provider) {
    return 0
  }

  const chainId = await window.web3Provider.request({ method: 'eth_chainId' })
  return chainId
}

export async function getAccount() {
  if (!window.web3Provider) {
    return null
  }

  const web3 = new Web3(window.web3Provider)
  const accounts = await web3.eth.getAccounts()
  return accounts[0]
}

export async function getEthBalance() {
  if (!window.web3Provider) {
    return 0
  }

  const web3 = new Web3(window.web3Provider)
  const account = await getAccount()
  if (!account) {
    return 0
  }
  const balance = await web3.eth.getBalance(account)
  return web3.utils.fromWei(balance, 'ether')
}

export async function getERC20Balance(tokenAddress, ownerAddress) {
  if (!window.web3Provider || tokenAddress === '') {
    return 0
  }
  const web3 = new Web3(window.web3Provider)
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

export async function getBapSalePrice() {
  if (!window.web3Provider) {
    return 0
  }

  const web3 = new Web3(window.web3Provider)
  const bapSaleContract = new web3.eth.Contract(
    BAPSaleContractABI.abi,
    process.env.REACT_APP_BAPSALECONTRACT
  )

  const price = await bapSaleContract.methods.bapPrice().call()
  return parseFloat((parseInt(price) / 100000000).toFixed(8))
}

export async function buyBapTokens(bapAmount, token, tokenAmount, callback) {
  if (!window.web3Provider) {
    return
  }

  console.log(bapAmount, tokenAmount)

  const web3 = new Web3(window.web3Provider)
  const bapSaleContract = new web3.eth.Contract(
    BAPSaleContractABI.abi,
    process.env.REACT_APP_BAPSALECONTRACT
  )

  const ABI = [
    {
      inputs: [],
      name: 'decimals',
      outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'approve',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ]

  const bapToken = new web3.eth.Contract(ABI, process.env.REACT_APP_BAPTOKEN)
  const bapDecimals = await bapToken.methods.decimals().call()
  bapAmount = new BN(String(bapAmount)).mul(
    new BN('10').pow(new BN(bapDecimals))
  )

  let tx = {
    gas: '0x5208',
    gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
    from: await getAccount(),
    to: '',
    data: '',
    value: '0',
  }

  if (token === '') {
    token = '0x0000000000000000000000000000000000000000'
    tx.value = web3.utils.toHex(
      web3.utils.toWei(tokenAmount.toFixed(18), 'ether')
    )
    tokenAmount = '0'
  } else {
    const tokenContract = new web3.eth.Contract(ABI, token)
    const tokenDecimals = await tokenContract.methods.decimals().call()
    tokenAmount = new BN(tokenAmount.toFixed(tokenDecimals)).mul(
      new BN('10').pow(new BN(tokenDecimals))
    )
    tx.to = token
    tx.data = tokenContract.methods
      .approve(process.env.REACT_APP_BAPSALECONTRACT, tokenAmount)
      .encodeABI()

    const txHash = await window.web3Provider
      .request({
        method: 'eth_sendTransaction',
        params: [tx],
      })
      .then(() => {
        console.log('Transaction!!!')
      })
      .catch((err) => {
        callback()
      })
  }

  tx.to = process.env.REACT_APP_BAPSALECONTRACT
  tx.data = bapSaleContract.methods
    .buy(bapAmount, token, tokenAmount)
    .encodeABI()
  tx.gas = '0x5208'

  console.log(tx)

  await window.web3Provider
    .request({
      method: 'eth_sendTransaction',
      params: [tx],
    })
    .then(() => {
      console.log('Transaction!!!')
    })
    .catch((err) => {
      callback()
    })

  await bapSaleContract.once(
    'Purchased',
    {
      filter: { receiver: tx.from },
      fromBlock: 0,
    },
    function (error, event) {
      console.log(event)
      callback()
    }
  )
}
