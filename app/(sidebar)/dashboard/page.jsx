"use client"
import StudentProjectWidget from '@components/StudentProjectWidget'
import SupervisorStudentsWidget from '@components/SupervisorStudentsWidget'
import SupStudentSelect from '@components/SupStudentSelect'
import { Typography } from '@mui/material'
import Cookies from 'js-cookie'
import router from 'next/router'
import React, { useEffect, useState } from 'react'
import { Bounce, toast, ToastContainer } from 'react-toastify'

const page = () => {
  const handleToast = () => {toast.success("Success")}
  const [userRole , setUserRole] = useState();

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
    <Typography variant="h5" gutterBottom>
        {renderContent()} Dashboard
      </Typography>
      {
        userRole == 'STUDENT' && 
          <StudentProjectWidget/>
      }
      {userRole == 'ACADEMIC' && 
      <>
          <SupervisorStudentsWidget/>
      </>
      }
    </>
  )
}

export default page