import React from 'react'
import { Heromain } from '../components/Hero/Heromain'
import FeaturedClub from '../components/Hero/home/FeaturedClub'
import HowClubSphereWorks from '../components/Hero/home/HowClubSphereWorks'
import WhyJoinAClub from '../components/Hero/home/WhyJoinAClub'

const Home = () => {
  return (
    <div>
        <Heromain></Heromain>
        <FeaturedClub></FeaturedClub>
        <HowClubSphereWorks></HowClubSphereWorks>
        <WhyJoinAClub></WhyJoinAClub>
    </div>
  )
}

export default Home