import React from 'react'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
import { Box, Stack } from '@mui/material'
import BapBuyingPage from './pages/BapBuyingPage'
import AdminPanelPage from './pages/AdminPanelPage'

export default function App() {
  return (
    <Box>
      <Stack height="100vh" justifyContent="center" alignItems="center">
        <Router>
          <Routes>
            <Route path="/" element={<BapBuyingPage />} />
            <Route path="/admin" element={<AdminPanelPage />} />
          </Routes>
        </Router>
      </Stack>
    </Box>
  )
}
