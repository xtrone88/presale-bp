import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Stack,
  CircularProgress,
  Divider as MuiDivider,
  TextField,
  Button,
} from '@mui/material'
import { indigo } from '@mui/material/colors'
import { styled } from '@mui/material/styles'

import ConnectWallet from '../components/ConnectWallet'
import StableCoinSelection from '../components/StableCoinSelection'
import TokenSelection from '../components/TokenSelection'
import WithrawTransaction from '../components/WithrawTransaction'

import {
  COINS,
  COIN_NAMES,
  COIN_LOGOS,
  COIN_DECIMALS,
  COIN_SLIDER_STEP,
  COINMAP,
} from '../config/blockchain'
import { getBapSalePrice, setBapPrice, approveBapToSale } from '../web3/index'

const Divider = styled(MuiDivider)`
  width: 100%;
`

export default function AdminPanelPage() {
  const [connected, setConnected] = useState(false)
  const [waitPrice, setWaitPrice] = useState(false)
  const [waitApprove, setWaitApprove] = useState(false)
  const [bapUnitPrice, setBapUnitPrice] = useState(0)

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
    })
  }, [connected])

  useEffect(() => {
    if (waitPrice) {
      if (bapUnitPrice === 0) {
        setWaitPrice(false)
        return
      }
    }
  }, [waitPrice])

  return (
    <>
      <Box>
        <Card variant="outlined" sx={{ width: 400 }}>
          <CardHeader
            title="BAP PRICE AND APPROVE"
            titleTypographyProps={{ variant: 'h6', sx: { color: 'white' } }}
            sx={{ backgroundColor: indigo[500] }}
          />
          <CardContent>
            <Stack direction="row" justifyContent="center" spacing={2}>
              <TextField
                value={bapUnitPrice}
                size="small"
                label="Price($)"
                type="number"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setBapUnitPrice(
                    event.target.value === '' ? 0 : Number(event.target.value)
                  )
                }}
                sx={{ width: 100 }}
              />
              <Box sx={{ position: 'relative' }}>
                <Button
                  color="primary"
                  variant="contained"
                  disabled={!connected || waitPrice}
                  onClick={() => {
                    setWaitPrice(true)
                    setBapPrice(Math.pow(10, 8) * bapUnitPrice, () => {
                      window.location.reload()
                    })
                  }}
                >
                  Set Price
                </Button>
                {waitPrice && (
                  <CircularProgress
                    color="secondary"
                    size={24}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                    }}
                  />
                )}
              </Box>
              <Box sx={{ position: 'relative' }}>
                <Button
                  color="secondary"
                  variant="contained"
                  disabled={!connected || waitApprove}
                  onClick={() => {
                    setWaitApprove(true)
                    approveBapToSale(() => {
                      window.location.reload()
                    })
                  }}
                >
                  Approve
                </Button>
                {waitApprove && (
                  <CircularProgress
                    color="secondary"
                    size={24}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                    }}
                  />
                )}
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ marginTop: '16px' }}>
        <Card variant="outlined" sx={{ width: 400 }}>
          <CardHeader
            title="WITHRAW"
            titleTypographyProps={{ variant: 'h6', sx: { color: 'white' } }}
            sx={{ backgroundColor: indigo[500] }}
          />
          <CardContent>
            <Stack
              direction="column"
              alignItems="stretch"
              justifyContent="center"
              spacing={2}
            >
              <StableCoinSelection
                account={
                  process.env.REACT_APP_BAPSALECONTRACT
                    ? process.env.REACT_APP_BAPSALECONTRACT
                    : ''
                }
                chainId={chainId}
                payment={coinAmount}
                onChanged={(coin: COINS, balance: number, amount: number) => {
                  setCoinId(coin)
                  setCoinBalance(balance)
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
              {connected && (
                <TokenSelection
                  name={COIN_NAMES[coinId]}
                  avatar={COIN_LOGOS[coinId]}
                  value={0}
                  min={0}
                  max={coinBalance}
                  step={COIN_SLIDER_STEP[coinId]}
                  onChange={(value: number) => {
                    setCoinAmount(value)
                  }}
                />
              )}
              {connected && (
                <WithrawTransaction
                  coinAddress={COINMAP[chainId] ? COINMAP[chainId][coinId] : ''}
                  coinBalance={coinBalance}
                  coinAmount={coinAmount}
                />
              )}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </>
  )
}
