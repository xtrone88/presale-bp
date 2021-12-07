import Web3 from 'web3'

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
  const balance = await web3.eth.getBalance(account)
  return web3.utils.fromWei(balance, 'ether')
}

export async function getERC20Balance(tokenAddress) {
  if (!window.ethereum) {
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
  const balance = await contract.methods.balanceOf(account).call()
  const decimal = await contract.methods.decimals().call()

  return balance
}
