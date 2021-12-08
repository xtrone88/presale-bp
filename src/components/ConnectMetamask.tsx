import React, { useEffect, useState } from 'react'
import { Box, Button, Snackbar, Alert } from '@mui/material'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'

import { getChainId } from '../web3/index'
import { COINS, CHAINS } from '../config/blockchain'

declare global {
  interface Window {
    ethereum?: any
  }
}

const injected = new InjectedConnector({
  supportedChainIds: [CHAINS.ETHEREUM, CHAINS.BINANCE, CHAINS.RINKEBY],
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
  onAccountChanged?: Function
  onChainChanged?: Function
}

export default function ConnectMetamask(props: PropsType) {
  const { activate, deactivate, active, error } = useWeb3React()

  const handleAccountsChanged = (accounts: string[]) => {
    if (props.onAccountChanged) {
      props.onAccountChanged(accounts[0])
    }
  }

  const handleChainChanged = (chainId: string) => {
    if (props.onChainChanged) {
      props.onChainChanged(parseInt(chainId))
    }
  }

  const hasConnected = () => {
    return active || window.ethereum
  }

  useEffect(() => {
    if (hasConnected() && props.onConnected) {
      props.onConnected()
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
      getChainId().then((chainId) => {
        if (props.onChainChanged) {
          props.onChainChanged(parseInt(chainId))
        }
      })
    }
    return function cleanup() {
      deactivate()
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
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
        style={{ display: hasConnected() ? 'none' : '' }}
      >
        {props.caption}
      </Button>
      <Snackbar open={!!error} autoHideDuration={3000}>
        <Alert severity="error">{error ? getErrorMessage(error) : ''}</Alert>
      </Snackbar>
    </Box>
  )
}
