"use client"
import React from 'react'
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