const { ethers, waffle } = require('hardhat')
require('dotenv').config()

async function main() {
  const [owner] = await ethers.getSigners()

  const BAPToken = await ethers.getContractFactory('TokenMintERC20Token')
  const bap = await BAPToken.deploy(
    'BAP Token',
    'BAP',
    8,
    1000000000000,
    owner.address,
    owner.address
  )
  await bap.deployed()

  console.log('BAPToken deployed to:', bap.address)

  const BAPSaleContract = await ethers.getContractFactory('BAPSaleContract')
  const bapSale = await BAPSaleContract.deploy(bap.address, owner.address)
  await bapSale.deployed()

  console.log('BAPSaleContract deployed to:', bapSale.address)

  await bap.approve(bapSale.address, bap.balanceOf(owner.address))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
