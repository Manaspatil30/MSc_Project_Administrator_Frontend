"use client"
import StudentProjectWidget from '@components/StudentProjectWidget'
import StudentUpcomingSessionWidget from '@components/StudentUpcomingSessionWidget'
import SupervisorProjectsWidget from '@components/SupervisorProjectsWidget'
import SupervisorStudentsWidget from '@components/SupervisorStudentsWidget'
import SupervisorUpcomingSessionWidget from '@components/SupervisorUpcomingSessionWidget'
import SupStudentSelect from '@components/SupStudentSelect'
import { Grid, Typography } from '@mui/material'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import router from 'next/router'
import React, { useEffect, useState } from 'react'
import { Bounce, toast, ToastContainer } from 'react-toastify'

const page = () => {
  const handleToast = () => {toast.success("Success")}
  const [userRole , setUserRole] = useState();
  const router = useRouter();

  if(!Cookies.get('token')){
    router.push('/login')
  }

  useEffect(()=>{
    // @ts-ignore
    setUserRole(Cookies.get('user_role'))
  },[userRole])
  const renderContent = () => {
    if(userRole == 'STUDENT'){
      return (
        <>
        Student
        </>
      )
    }
    if(userRole == 'ACADEMIC'){
      return (
        <>
        Supervisor
        </>
      )
    }
    if(userRole == 'MOD_OWNER'){
      return (
        <>
        Module Owner
        </>
      )
    }
  }
  return (
    <>
    <Typography fontWeight={700} variant="h5" gutterBottom>
        {renderContent()} Dashboard
      </Typography>
      {
        userRole == 'STUDENT' && 
        <>
          <StudentProjectWidget/>
          <Grid container>
        <Grid item xs={5} mt={3}>
        <StudentUpcomingSessionWidget/>
        </Grid>
      </Grid>
        </>
      }
      {userRole == 'ACADEMIC' && 
      <>
      <SupervisorStudentsWidget/>
      <SupervisorProjectsWidget/>
      <Grid container>
        <Grid item xs={5} mt={3}>
        <SupervisorUpcomingSessionWidget/>
        </Grid>
      </Grid>
      </>
      }
    </>
  )
}

export default page