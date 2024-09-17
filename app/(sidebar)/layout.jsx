import SideNavbar from '@components/SideNavbar'
import checkTokenExpiry from '@utils/checkTokenExpiry'
import React from 'react'
import { Bounce, ToastContainer } from 'react-toastify'

const layout = ({children}) => {
  return (
    <div>
        <SideNavbar children={children}/>
    </div>
  )
}

export default layout