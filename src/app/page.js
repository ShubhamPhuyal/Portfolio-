
'use client'

import { useRef } from 'react'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import StackSection from './components/StackSection'
import Doodle from './components/Doodle'
import Works from './components/Works'

export default function Home() {
  const heroRef = useRef(null)
  const cardRef = useRef(null)

  return (
    <div className="relative">
      <Header />
      <div className="relative isolate flow-root h-[362.5svh]">
        <div className="sticky top-0 z-0 flex h-svh flex-col">
          <div aria-hidden="true" className="h-20 shrink-0 sm:h-24" />
          <HeroSection motionRef={heroRef} cardRef={cardRef} />
        </div>
        <StackSection heroRef={heroRef} cardRef={cardRef} />
      </div>
      <Doodle />
      <Works />
    </div>
  )
}