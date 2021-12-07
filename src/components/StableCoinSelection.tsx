import React, { useState } from 'react'
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
} from '@mui/material'

const Logo = styled.img`
  height: 30px;
  cursor: pointer;
`

const MenuItem = muiStyled(MuiMenuItem)`
  display: flex;
  justify-content: center;
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

const COIN_NAMES = ['ETH', 'USDT', 'DOGE']

export default function StableCoinSelection() {
  const [coin, setCoin] = useState(COINS.ETH)
  const [balance, setBalance] = useState(0)
  const [payment, setPayment] = useState(0)

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
          <Typography variant="h4" align="center">
            {balance}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6">PAYMENT</Typography>
          <Typography variant="h4" align="center">
            {payment}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}
