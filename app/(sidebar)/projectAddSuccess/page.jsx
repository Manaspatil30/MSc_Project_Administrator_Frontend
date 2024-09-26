import { Box, Typography } from '@mui/material'
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React from 'react'

const page = () => {
  const router = useRouter();

  if(!Cookies.get('token')){
    router.push('/login')
  }
  return (
    <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
        <Typography fontSize={"1rem"} fontWeight={700}>
        Your Project is Added Successfully
        </Typography>
    </Box>
  )
}

export default page