import React, { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Snackbar, Alert } from '@mui/material'

import { COINS, COINMAP } from '../config/blockchain'
import { withrawFund } from '../web3/index'

type PropsType = {
  coinAddress: string
  coinBalance: number
  coinAmount: number
}

export default function WithrawTransaction(props: PropsType) {
  const [waiting, setWaiting] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (waiting) {
      if (props.coinAmount === 0 || props.coinBalance < props.coinAmount) {
        setError(true)
        setWaiting(false)
        return
      }
    }
  }, [waiting])

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <Button
          fullWidth
          variant="contained"
          disabled={waiting}
          onClick={() => {
            setWaiting(true)
            withrawFund(props.coinAddress, props.coinAmount, () => {
              window.location.reload()
            })
          }}
        >
          Withraw Fund
        </Button>
        {waiting && (
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
      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => {
          setError(false)
        }}
      >
        <Alert severity="error">Please confirm the balance and withraw.</Alert>
      </Snackbar>
    </>
  )
}
