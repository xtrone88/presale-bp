import Web3 from 'web3'
import IERC20ABI from './ERC20.json'
import AggregatorV3Interface from './AggregatorV3Interface.json'
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

export async function getEthBalance(ownerAddress) {
  if (!window.web3Provider) {
    return 0
  }

  const web3 = new Web3(window.web3Provider)
  const account = await getAccount()
  if (!account) {
    return 0
  }
  console.log(ownerAddress, account)
  const balance = await web3.eth.getBalance(
    ownerAddress ? ownerAddress : account
  )
  console.log(balance)
  return web3.utils.fromWei(balance, 'ether')
}

export async function getERC20Balance(tokenAddress, ownerAddress) {
  if (!window.web3Provider || tokenAddress === '') {
    return 0
  }
  const web3 = new Web3(window.web3Provider)

  let contract = new web3.eth.Contract(IERC20ABI.abi, tokenAddress)
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
  const web3 = new Web3(process.env.REACT_APP_MAINNET_END_POINT)
  const priceFeed = new web3.eth.Contract(
    AggregatorV3Interface.abi,
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

  const web3 = new Web3(window.web3Provider)
  const bapSaleContract = new web3.eth.Contract(
    BAPSaleContractABI.abi,
    process.env.REACT_APP_BAPSALECONTRACT
  )

  const bapToken = new web3.eth.Contract(
    IERC20ABI.abi,
    process.env.REACT_APP_BAPTOKEN
  )
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
    const tokenContract = new web3.eth.Contract(IERC20ABI.abi, token)
    const tokenDecimals = await tokenContract.methods.decimals().call()
    tokenAmount = new BN(tokenAmount.toFixed(tokenDecimals)).mul(
      new BN('10').pow(new BN(tokenDecimals))
    )
    tx.to = token
    tx.data = tokenContract.methods
      .approve(process.env.REACT_APP_BAPSALECONTRACT, tokenAmount)
      .encodeABI()

    tx.gas = web3.utils.toHex(
      await web3.eth.estimateGas({
        from: tx.from,
        to: tx.to,
        data: tx.data,
      })
    )

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
  }

  tx.to = process.env.REACT_APP_BAPSALECONTRACT
  tx.data = bapSaleContract.methods
    .buy(bapAmount, token, tokenAmount)
    .encodeABI()

  tx.gas = web3.utils.toHex(
    await web3.eth.estimateGas({
      from: tx.from,
      to: tx.to,
      data: tx.data,
    })
  )

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

export async function setBapPrice(price, callback) {
  if (!window.web3Provider) {
    return
  }

  const web3 = new Web3(window.web3Provider)
  const bapSaleContract = new web3.eth.Contract(
    BAPSaleContractABI.abi,
    process.env.REACT_APP_BAPSALECONTRACT
  )

  let tx = {
    gas: '0x5208',
    gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
    from: await getAccount(),
    to: process.env.REACT_APP_BAPSALECONTRACT,
    data: await bapSaleContract.methods.setBapPrice(price).encodeABI(),
    value: '0',
  }

  tx.gas = web3.utils.toHex(
    await web3.eth.estimateGas({
      from: tx.from,
      to: tx.to,
      data: tx.data,
    })
  )

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
    'PriceChanged',
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

export async function approveBapToSale(callback) {
  if (!window.web3Provider) {
    return
  }
  const web3 = new Web3(window.web3Provider)
  const tokenContract = new web3.eth.Contract(
    IERC20ABI.abi,
    process.env.REACT_APP_BAPTOKEN
  )
  const balance = await tokenContract.methods
    .balanceOf(process.env.REACT_APP_BAP_OWNER)
    .call()

  let tx = {
    gas: '0x5208',
    gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
    from: await getAccount(),
    to: process.env.REACT_APP_BAPTOKEN,
    data: await tokenContract.methods
      .approve(process.env.REACT_APP_BAPSALECONTRACT, balance)
      .encodeABI(),
    value: '0',
  }

  tx.gas = web3.utils.toHex(
    await web3.eth.estimateGas({
      from: tx.from,
      to: tx.to,
      data: tx.data,
    })
  )

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
      console.log(err)
    })

  await tokenContract.once(
    'Approval',
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

export async function withrawFund(token, tokenAmount, callback) {
  if (!window.web3Provider) {
    return
  }

  const web3 = new Web3(window.web3Provider)
  const bapSaleContract = new web3.eth.Contract(
    BAPSaleContractABI.abi,
    process.env.REACT_APP_BAPSALECONTRACT
  )

  let tx = {
    gas: '0x5208',
    gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
    from: await getAccount(),
    to: process.env.REACT_APP_BAPSALECONTRACT,
    data: '',
    value: '0',
  }

  if (token === '') {
    token = '0x0000000000000000000000000000000000000000'
    tokenAmount = web3.utils.toHex(
      web3.utils.toWei(tokenAmount.toFixed(18), 'ether')
    )
  } else {
    const tokenContract = new web3.eth.Contract(IERC20ABI.abi, token)
    const tokenDecimals = await tokenContract.methods.decimals().call()
    tokenAmount = new BN(tokenAmount.toFixed(tokenDecimals)).mul(
      new BN('10').pow(new BN(tokenDecimals))
    )
  }

  tx.data = bapSaleContract.methods.withraw(token, tokenAmount).encodeABI()

  tx.gas = web3.utils.toHex(
    await web3.eth.estimateGas({
      from: tx.from,
      to: tx.to,
      data: tx.data,
    })
  )

  await window.web3Provider
    .request({
      method: 'eth_sendTransaction',
      params: [tx],
    })
    .then(() => {
      console.log('Transaction!!!')
      callback()
    })
    .catch((err) => {
      callback()
    })
}
