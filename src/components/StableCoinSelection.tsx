import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { styled as muiStyled } from '@mui/material/styles'
import {
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem as MuiMenuItem,
  Tooltip,
} from '@mui/material'

import { getEthBalance, getERC20Balance, getLatestPriceOf } from '../web3/index'
import {
  COINS,
  CHAINS,
  COINMAP,
  COIN_NAMES,
  COIN_LOGOS,
  PRICE_FEEDER,
} from '../config/blockchain'

const Logo = styled.img`
  height: 30px;
  cursor: pointer;
`

const MenuItem = muiStyled(MuiMenuItem)`
  display: flex;
  justify-content: center;
`

const BalDisplay = muiStyled(Typography)`
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
`

type PropsType = {
  account: string
  chainId: number
  bapPrice: number
}

export default function StableCoinSelection(props: PropsType) {
  const [coin, setCoin] = useState(COINS.ETH)
  const [balance, setBalance] = useState('0')
  const [payment, setPayment] = useState(0)
  const [price, setPrice] = useState(0)

  useEffect(() => {
    if (!COINMAP[props.chainId]) {
      return
    }
    if (props.chainId === CHAINS.BINANCE) {
      getERC20Balance(COINMAP[props.chainId][coin]).then((bal) => {
        setBalance(bal as string)
      })
    } else {
      if (coin === COINS.ETH) {
        getEthBalance().then((bal) => {
          setBalance(bal as string)
        })
      } else {
        getERC20Balance(COINMAP[props.chainId][coin]).then((bal) => {
          setBalance(bal as string)
        })
      }
    }
  }, [coin, props.account, props.chainId])

  useEffect(() => {
    getLatestPriceOf(PRICE_FEEDER[coin]).then((price) => {
      setPrice(price)
      setPayment(price > 0 ? props.bapPrice / price : 0)
    })
  }, [coin])

  useEffect(() => {
    setPayment(price > 0 ? props.bapPrice / price : 0)
  }, [props.bapPrice])

  return (
    <Box>
      <Grid
        container
        spacing={4}
        alignItems="top"
        justifyContent="space-between"
      >
        <Grid item>
          <FormControl fullWidth>
            <InputLabel id="select-coin-label">{COIN_NAMES[coin]}</InputLabel>
            <Select
              labelId="select-coin-label"
              label={COIN_NAMES[coin]}
              value={coin}
              onChange={(v) => {
                setCoin(v.target.value as COINS)
              }}
              sx={{ width: 80 }}
            >
              <MenuItem value={COINS.ETH}>
                <Logo src={COIN_LOGOS[COINS.ETH]} />
              </MenuItem>
              <MenuItem value={COINS.USDT}>
                <Logo src={COIN_LOGOS[COINS.USDT]} />
              </MenuItem>
              {/* <MenuItem value={COINS.DOGE}>
                <Logo src={COIN_LOGOS[COINS.DOGE]} />
              </MenuItem> */}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <Typography variant="h6">BALANCE</Typography>
          <Tooltip title={balance}>
            <BalDisplay variant="h6" align="center">
              {balance}
            </BalDisplay>
          </Tooltip>
        </Grid>
        <Grid item>
          <Typography variant="h6">PAYMENT</Typography>
          <Tooltip title={payment}>
            <BalDisplay variant="h6" align="center">
              {payment}
            </BalDisplay>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  )
}
