import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import { Box, Grid, Typography, Slider, Input, Avatar } from '@mui/material'

type PropsType = {
  value: number
  balance: number
  onChange?: Function
}

export default function BapTokenSelection(props: PropsType) {
  const [value, setValue] = useState(props.value)

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target) {
      setValue(event.target.value === '' ? 1 : Number(event.target.value))
    }
  }

  const handleBlur = () => {
    if (value <= 0) {
      setValue(1)
    } else if (value > props.balance) {
      setValue(props.balance)
    }
  }

  useEffect(() => {
    if (value != props.value) {
      if (props.onChange) {
        props.onChange(value)
      }
    }
  }, [value])

  return (
    <Box>
      <Typography id="bap-slider" variant="h6">
        BAP
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Avatar
            alt="BAP Logo"
            src="https://cdn.shopify.com/s/files/1/0602/8630/4509/products/BAPPNG_ca04f2e0-13a6-4027-a292-4e07fb28d99a_180x180.png?v=1634449008"
          />
        </Grid>
        <Grid item xs>
          <Slider
            color="secondary"
            size="small"
            min={1}
            max={props.balance}
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="bap-slider"
          />
        </Grid>
        <Grid item>
          <Input
            value={value}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 1,
              min: 1,
              max: props.balance,
              type: 'number',
              'aria-labelledby': 'bap-slider',
            }}
            sx={{ width: 80 }}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
