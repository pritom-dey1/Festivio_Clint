import React from 'react'
import Navbar from '../components/Global/Navbar'
import { Outlet } from 'react-router'
import { Footer } from '../components/Global/Footer'

const Eventlayout = () => {
  return (
    <div>
        <Navbar></Navbar>
        <Outlet></Outlet>
        <Footer></Footer>
    </div>
  )
}

export default Eventlayout