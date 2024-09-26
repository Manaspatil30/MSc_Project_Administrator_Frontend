"use client"
import SupStudentSelect from '@components/SupStudentSelect'
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React from 'react'

const page = () => {
  const router = useRouter();

  if(!Cookies.get('token')){
    router.push('/login')
  }
  return (
    <div>
        <SupStudentSelect/>
    </div>
  )
}

export default page