import { Box, Typography } from '@mui/material'
import React from 'react'

const page = () => {
  return (
    <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
        <Typography fontSize={"1rem"} fontWeight={700}>
        Your Project is Added Successfully
        </Typography>
    </Box>
  )
}

export default page