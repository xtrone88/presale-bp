import React from 'react'
import { Box, Stack } from '@mui/material'
import BapBuyingPage from './pages/BapBuyingPage'

export default function App() {
  return (
    <Box>
      <Stack height="100vh" justifyContent="center" alignItems="center">
        <BapBuyingPage />
      </Stack>
    </Box>
  )
}
