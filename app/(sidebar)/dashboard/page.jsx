"use client"
import Cookies from 'js-cookie'
import router from 'next/router'
import React, { useEffect } from 'react'
import { Bounce, toast, ToastContainer } from 'react-toastify'

const page = () => {
  const handleToast = () => {toast.success("Success")}
  return (
    <>
    <button onClick={handleToast}>Dashboard</button>
    </>
  )
}

export default page