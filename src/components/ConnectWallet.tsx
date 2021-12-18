import React, { useEffect, useState } from 'react'
import { Box, Button, Snackbar, Alert } from '@mui/material'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { NoEthereumProviderError } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

import { getChainId } from '../web3/index'
import { COINS, CHAINS } from '../config/blockchain'

const getErrorMessage = (error: Error) => {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network."
  } else {
    return error.message
  }
}

type PropsType = {
  caption: string
  color: 'primary' | 'secondary'
  wallet: 'metamask' | 'walletconnect'
  onConnected?: Function
  onAccountChanged?: Function
  onChainChanged?: Function
}

const connectors = {
  metamask: new InjectedConnector({
    supportedChainIds: [CHAINS.ETHEREUM, CHAINS.BINANCE, CHAINS.RINKEBY],
  }),
  walletconnect: new WalletConnectConnector({
    supportedChainIds: [CHAINS.ETHEREUM, CHAINS.BINANCE, CHAINS.RINKEBY],
  }),
} as {
  [key: string]: any
}

export default function ConnectWallet(props: PropsType) {
  const { activate, deactivate, active, error } = useWeb3React()
  const [connected, setConnected] = useState(false)

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
    return active
  }

  let connector: any = connectors[props.wallet]

  useEffect(() => {
    if (hasConnected() && connector) {
      connector.getProvider().then((provider: any) => {
        if (!provider) {
          return
        }
        setConnected(true)
        if (props.onConnected) {
          props.onConnected(provider)
        }
        provider.on('accountsChanged', handleAccountsChanged)
        provider.on('chainChanged', handleChainChanged)
        getChainId().then((chainId) => {
          if (props.onChainChanged) {
            props.onChainChanged(parseInt(chainId))
          }
        })
      })
    }
  }, [active])

  return (
    <>
      <Button
        fullWidth
        color={props.color}
        variant="contained"
        onClick={() => {
          activate(connector)
        }}
        sx={{ display: connected ? 'none' : '' }}
      >
        {props.caption}
      </Button>
      <Snackbar open={!!error} autoHideDuration={3000}>
        <Alert severity="error">{error ? getErrorMessage(error) : ''}</Alert>
      </Snackbar>
    </>
  )
}
