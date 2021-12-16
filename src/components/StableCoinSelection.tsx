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
  bapPrice?: number
  payment?: number
  onChanged?: Function
}

export default function StableCoinSelection(props: PropsType) {
  const [coin, setCoin] = useState(COINS.ETH)
  const [balance, setBalance] = useState(0)
  const [payment, setPayment] = useState(props.payment ? props.payment : 0)
  const [price, setPrice] = useState(0)

  useEffect(() => {
    if (!COINMAP[props.chainId]) {
      return
    }
    if (props.chainId === CHAINS.BINANCE) {
      getERC20Balance(COINMAP[props.chainId][coin], props.account).then(
        (bal) => {
          setBalance(parseFloat(bal))
        }
      )
    } else {
      if (coin === COINS.ETH) {
        getEthBalance(props.account).then((bal) => {
          setBalance(parseFloat(bal as string))
        })
      } else {
        getERC20Balance(COINMAP[props.chainId][coin], props.account).then(
          (bal) => {
            setBalance(parseFloat(bal))
          }
        )
      }
    }
  }, [coin, props.account, props.chainId])

  const updatePayment = (price: number) => {
    if (props.bapPrice) {
      const payment = price > 0 ? props.bapPrice / price : 0
      setPayment(payment)
    }
  }

  useEffect(() => {
    if (props.payment) {
      getLatestPriceOf(PRICE_FEEDER[coin]).then((price) => {
        setPrice(price)
        updatePayment(price)
      })
    }
  }, [coin])

  useEffect(() => {
    if (props.payment) {
      updatePayment(price)
    }
  }, [props.bapPrice])

  useEffect(() => {
    if (props.onChanged) {
      props.onChanged(coin, balance, payment)
    }
  }, [coin, balance, payment])

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
              <MenuItem value={COINS.USDC}>
                <Logo src={COIN_LOGOS[COINS.USDC]} />
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <Typography variant="h6">BALANCE</Typography>
          <Tooltip title={balance.toFixed(12)}>
            <BalDisplay variant="h6" align="center">
              {balance.toFixed(8)}
            </BalDisplay>
          </Tooltip>
        </Grid>
        <Grid item>
          <Typography variant="h6">AMOUNT</Typography>
          <Tooltip
            title={
              props.payment ? props.payment.toFixed(12) : payment.toFixed(12)
            }
          >
            <BalDisplay variant="h6" align="center">
              {props.payment ? props.payment.toFixed(8) : payment.toFixed(8)}
            </BalDisplay>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  )
}
