"use client"
import StudentTasterSessions from '@components/StudentTasterSessions'
import SupervisorTasterSessions from '@components/SupervisorTasterSessions'
import { Typography } from '@mui/material'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import NoSSR from 'react-no-ssr'

const page = () => {
  
  const userRole = Cookies.get('user_role');

  const router = useRouter();

  if(!Cookies.get('token')){
    router.push('/login')
  }
  
  return (
    <>
    <Typography variant='h4' fontWeight={700} mb={2}>Taster Sessions</Typography>
    {
      userRole == "STUDENT" && 
      <StudentTasterSessions/>
    }
    {
      userRole == "ACADEMIC" && 
        <SupervisorTasterSessions/>
    }
    </>
  )
}

export default page