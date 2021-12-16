const { expect } = require('chai')
const { ethers, waffle } = require('hardhat')

describe('BAPSaleContract', function () {
  let bap, bapSale

  before(async () => {
    const [owner] = await ethers.getSigners()

    const BAPToken = await ethers.getContractFactory('TokenMintERC20Token')
    bap = await BAPToken.deploy(
      'BAP Token',
      'BAP',
      8,
      10000 * Math.pow(10, 8),
      owner.address,
      owner.address
    )
    await bap.deployed()

    const BAPSaleContract = await ethers.getContractFactory('BAPSaleContract')
    bapSale = await BAPSaleContract.deploy(bap.address, owner.address)
    await bapSale.deployed()

    await bap.approve(bapSale.address, bap.balanceOf(owner.address))
  })

  it('getLatestPrice', async () => {
    const [owner] = await ethers.getSigners()
    console.log(
      await bapSale.getLatestPrice('0x8A753747A1Fa494EC906cE90E9f37563A8AF630e')
    )
  })
  // 1000000000000000000
  it('buyBapToken and withraw', async () => {
    const [owner, ...addrs] = await ethers.getSigners()

    const tester = addrs[3]
    console.log(
      'Before Buying',
      await waffle.provider.getBalance(bapSale.address),
      await waffle.provider.getBalance(tester.address)
    )
    await bapSale
      .connect(tester)
      .buy(
        1000 * Math.pow(10, 8),
        '0x0000000000000000000000000000000000000000',
        0,
        {
          value: ethers.utils.parseEther('1'),
        }
      )
    console.log(
      'After Buying',
      await waffle.provider.getBalance(bapSale.address),
      await waffle.provider.getBalance(tester.address)
    )

    const purchased = await bap.balanceOf(tester.address)
    console.log('Purchased', purchased)

    await bapSale.withraw(
      '0x0000000000000000000000000000000000000000',
      '40092453691550357'
    )

    console.log(
      'After Withrawing',
      await waffle.provider.getBalance(bapSale.address),
      await waffle.provider.getBalance(owner.address)
    )
  })
})
