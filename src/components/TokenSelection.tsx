import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Box, Grid, Typography, Slider, Input, Avatar } from '@mui/material'

const Logo = styled.img`
  height: 40px;
  cursor: pointer;
`

type PropsType = {
  name: string
  avatar: string
  min: number
  max: number
  step: number
  value: number
  onChange?: Function
}

export default function TokenSelection(props: PropsType) {
  const [value, setValue] = useState(props.value)

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target) {
      setValue(
        event.target.value === '' ? props.min : Number(event.target.value)
      )
    }
  }

  const handleBlur = () => {
    if (value <= 0) {
      setValue(1)
    } else if (value > props.max) {
      setValue(props.max)
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
        {props.name}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Logo src={props.avatar} />
        </Grid>
        <Grid item xs>
          <Slider
            color="secondary"
            size="small"
            min={props.min}
            max={props.max}
            step={props.step}
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="bap-slider"
          />
        </Grid>
        <Grid item>
          <Input
            value={parseFloat(value.toFixed(8))}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: props.step,
              min: props.min,
              max: props.max,
              type: 'number',
              'aria-labelledby': 'bap-slider',
            }}
            sx={{ width: 120 }}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
