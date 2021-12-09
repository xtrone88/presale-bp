const { ethers, waffle } = require('hardhat')
require('dotenv').config()

async function main() {
  const [owner] = await ethers.getSigners()

  const BAPSaleContract = await ethers.getContractFactory('BAPSaleContract')
  const bapSale = await BAPSaleContract.deploy(
    process.env.REACT_APP_BAPTOKEN,
    process.env.REACT_APP_BAP_OWNER
  )
  await bapSale.deployed()

  console.log('BAPSaleContract deployed to:', bapSale.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
