import React from 'react'
import AboutHero from '../components/About/AboutHero'
import ProblemSolve from '../components/About/ProblemSolve'
import Team from '../components/About/Team'
import Timeline from '../components/About/Timeline'
import WhoCanUse from '../components/About/WhoCanUse'

const About = () => {
  return (
    <div>
        <AboutHero></AboutHero>
        <ProblemSolve></ProblemSolve>
        <Team></Team>
        <Timeline></Timeline>
        <WhoCanUse></WhoCanUse>
    </div>
  )
}

export default About