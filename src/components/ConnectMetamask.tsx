import React, { useEffect, useState } from 'react'
import { Box, Button, Snackbar, Alert } from '@mui/material'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'

declare global {
  interface Window {
    ethereum?: any
  }
}

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 137],
})

const getErrorMessage = (error: Error) => {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network."
  } else if (error instanceof UserRejectedRequestErrorInjected) {
    return 'Please authorize this website to access your Ethereum account.'
  } else {
    return error.message
  }
}

type PropsType = {
  caption: string
  onConnected?: Function
}

export default function ConnectMetamask(props: PropsType) {
  const { chainId, activate, deactivate, active, error } = useWeb3React()
  const [connectedNetwork, setConnectedNetwork] = useState('')

  useEffect(() => {
    console.log('active', active)
    if (active && props.onConnected) {
      props.onConnected()
    }
  }, [active])

  return (
    <Box>
      <Button
        fullWidth
        variant="contained"
        onClick={() => {
          activate(injected)
        }}
      >
        {props.caption}
      </Button>
      <Snackbar open={!!error} autoHideDuration={3000}>
        <Alert severity="error">{error ? getErrorMessage(error) : ''}</Alert>
      </Snackbar>
    </Box>
  )
}
