import React, { useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Stack,
  Typography,
  Divider as MuiDivider,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { indigo } from '@mui/material/colors'
import ConnectWallet from '../components/ConnectWallet'
import BapTokenSelection from '../components/BapTokenSelection'
import StableCoinSelection from '../components/StableCoinSelection'
import BuyTransaction from '../components/BuyTransaction'

import { COINS, COINMAP } from '../config/blockchain'
import { getBapSalePrice, getERC20Balance } from '../web3/index'

declare global {
  interface Window {
    web3Provider?: any
  }
}

const Divider = styled(MuiDivider)`
  width: 100%;
`

export default function BapBuyingPage() {
  const [connected, setConnected] = useState(false)
  const [bapAmount, setBapAmount] = useState(1)
  const [bapLimit, setBapLimit] = useState(1)

  const [bapUnitPrice, setBapUnitPrice] = useState(0)
  const [bapPrice, setBapPrice] = useState(bapUnitPrice * bapAmount)
  const [account, setAccount] = useState('')
  const [chainId, setChainId] = useState(0)

  const [coinId, setCoinId] = useState(0)
  const [coinAmount, setCoinAmount] = useState(0)
  const [coinBalance, setCoinBalance] = useState(0)

  useEffect(() => {
    if (!connected) {
      return
    }
    getBapSalePrice().then((price) => {
      setBapUnitPrice(price)
      setBapPrice(price * bapAmount)
    })
    getERC20Balance(
      process.env.REACT_APP_BAPTOKEN,
      process.env.REACT_APP_BAP_OWNER
    ).then((bapLimit) => {
      setBapLimit(parseFloat(bapLimit))
    })
  }, [connected])

  return (
    <Card variant="outlined" sx={{ width: 400 }}>
      <CardHeader
        title="BUY THE BAP"
        titleTypographyProps={{ variant: 'h6', sx: { color: 'white' } }}
        avatar={
          <Avatar
            alt="BAP Logo"
            src="https://static.wixstatic.com/media/513284_ebf737e311914d559a57b7c67261396e~mv2.png/v1/crop/x_426,y_461,w_546,h_569/fill/w_240,h_250,al_c,q_85,usm_0.66_1.00_0.01/Graphs%20New%20(5).webp"
          />
        }
        sx={{ backgroundColor: indigo[500] }}
      />
      <CardContent>
        <Stack
          direction="column"
          alignItems="stretch"
          justifyContent="center"
          spacing={2}
        >
          <Typography align="center" variant="subtitle1">
            {bapAmount} BAP = {bapPrice.toFixed(2)} $
          </Typography>
          <Divider />
          <BapTokenSelection
            value={bapAmount}
            balance={bapLimit}
            onChange={(value: number) => {
              setBapAmount(value)
              setBapPrice(value * bapUnitPrice)
            }}
          />
          <Divider />
          <StableCoinSelection
            account={account}
            chainId={chainId}
            bapPrice={bapPrice}
            onChanged={(coin: COINS, balance: number, amount: number) => {
              setCoinId(coin)
              setCoinBalance(balance)
              setCoinAmount(amount)
            }}
          />
          <Divider />
          <ConnectWallet
            wallet="metamask"
            caption="Connect Metamask"
            color="primary"
            onConnected={(provider: any) => {
              window.web3Provider = provider
              console.log('Connected to Metamask')
              setConnected(true)
            }}
            onAccountChanged={(acc: string) => {
              console.log('Account has changed to ', acc)
              setAccount(acc)
            }}
            onChainChanged={(chain: number) => {
              console.log('Chain has changed to ', chain)
              setChainId(chain)
            }}
          ></ConnectWallet>
          <ConnectWallet
            wallet="walletconnect"
            caption="WalletConnect"
            color="secondary"
            onConnected={(provider: any) => {
              window.web3Provider = provider
              console.log('Connected to WalletConnect')
              setConnected(true)
            }}
            onAccountChanged={(acc: string) => {
              console.log('Account has changed to ', acc)
              setAccount(acc)
            }}
            onChainChanged={(chain: number) => {
              console.log('Chain has changed to ', chain)
              setChainId(chain)
            }}
          ></ConnectWallet>
          {connected && (
            <BuyTransaction
              bapAmount={bapAmount}
              coinAddress={COINMAP[chainId] ? COINMAP[chainId][coinId] : ''}
              coinBalance={coinBalance}
              coinAmount={coinAmount}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
