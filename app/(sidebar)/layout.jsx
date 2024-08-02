import SideNavbar from '@components/SideNavbar'
import React from 'react'

const layout = ({children}) => {
  return (
    <div>
        <SideNavbar children={children}/>
    </div>
  )
}

export default layout