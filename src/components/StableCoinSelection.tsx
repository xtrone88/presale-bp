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

import { getAccount, getEthBalance, getERC20Balance } from '../web3/index'

const Logo = styled.img`
  height: 30px;
  cursor: pointer;
`

const MenuItem = muiStyled(MuiMenuItem)`
  display: flex;
  justify-content: center;
`

const BalDisplay = muiStyled(Typography)`
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
`

enum COINS {
  ETH = 0,
  USDT,
  DOGE,
}

const COIN_LOGOS = [
  'https://cryptologos.cc/logos/thumbs/ethereum.png?v=014',
  'https://cryptologos.cc/logos/thumbs/tether.png?v=014',
  'https://cryptologos.cc/logos/thumbs/dogecoin.png?v=014',
]

const COIN_ADDRESSES = [
  '',
  '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
]

const COIN_NAMES = ['ETH', 'USDT', 'DOGE']

export default function StableCoinSelection() {
  const [coin, setCoin] = useState(COINS.ETH)
  const [balance, setBalance] = useState('0')
  const [payment, setPayment] = useState('0')

  useEffect(() => {
    if (coin === COINS.ETH) {
      getEthBalance().then((bal) => {
        setBalance(bal as string)
      })
    } else {
      getERC20Balance(COIN_ADDRESSES[coin]).then((bal) => {
        setBalance(bal as string)
      })
    }
  }, [coin])

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
              <MenuItem value={COINS.DOGE}>
                <Logo src={COIN_LOGOS[COINS.DOGE]} />
              </MenuItem>
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
