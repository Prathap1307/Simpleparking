'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

// ------------------- STYLES -------------------
const headerStyle = {
  position: 'fixed',
  top: 20,
  left: 20,
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  zIndex: 1000,
}

const brandTitle = {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#333',
  fontFamily: 'sans-serif',
}

const sectionContainer = {
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '40px 20px',
}

const contentBox = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 600,
  textAlign: 'center',
}

const progressIconContainer = {
  position: 'sticky',
  top: 30,
  marginBottom: 20,
}

const processCircle = {
  strokeDashoffset: 0,
  strokeWidth: 5,
  fill: 'none',
}

const progressIcon = {
  ...processCircle,
  transform: 'rotate(-90deg)',
  stroke: '#00b894',
}

const progressIconIndicator = {
  ...processCircle,
  stroke: '#00cec9',
}

const progressIconBg = {
  stroke: '#ccc',
  opacity: 0.3,
}

const textBlock = {
  marginTop: 20,
}

const heading = {
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#2d3436',
  marginBottom: 10,
  fontFamily: 'sans-serif',
}

const descriptionStyle = {
  fontSize: '1rem',
  color: '#636e72',
  fontFamily: 'sans-serif',
}

// ------------------- COMPONENTS -------------------
function Section({ title, description, bgColor }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section style={{ ...sectionContainer, backgroundColor: bgColor }}>
      <motion.div
        ref={ref}
        style={{ ...contentBox, y }}
        className="magnetic-zone"
      >
        <figure style={progressIconContainer}>
          <svg style={progressIcon} width="75" height="75" viewBox="0 0 100 100">
            <circle
              style={progressIconBg}
              cx="50"
              cy="50"
              r="30"
              pathLength="1"
              className="bg"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="30"
              pathLength="1"
              style={{
                ...progressIconIndicator,
                pathLength: scrollYProgress,
              }}
            />
          </svg>
        </figure>
        <motion.div style={textBlock}>
          <h2 style={heading}>{title}</h2>
          <p style={descriptionStyle}>{description}</p>
        </motion.div>
      </motion.div>
    </section>
  )
}

function CustomCursor() {
  const cursorRef = useRef(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const move = (e) => {
      setMouse({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const followMouse = () => {
      cursor.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`
      requestAnimationFrame(followMouse)
    }

    followMouse()
  }, [mouse])

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 30,
        height: 30,
        borderRadius: '50%',
        backgroundColor: 'rgba(0, 206, 201, 0.5)',
        mixBlendMode: 'difference',
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        transition: 'transform 0.15s ease',
        zIndex: 9999,
      }}
    />
  )
}

export default function SimpleParkingParallax() {
  const sections = [
    {
      title: 'Welcome to Simple Parking',
      description: 'Smart, stress-free parking made easy. Find, reserve, and park with confidence.',
      bgColor: '#f7f7f7',
    },
    {
      title: 'Real-Time Spot Tracking',
      description: 'Monitor live availability and secure your parking spot from anywhere.',
      bgColor: '#e0f7f9',
    },
    {
      title: 'Secure & Monitored 24/7',
      description: 'All our locations are equipped with CCTV and secure access systems.',
      bgColor: '#f1f0ff',
    },
    {
      title: 'Cashless & Contactless',
      description: 'Pay seamlessly using your phone. No tickets. No hassle.',
      bgColor: '#fff2e0',
    },
    {
      title: 'Reserve Ahead',
      description: 'Skip the wait. Reserve your parking before you arrive with one tap.',
      bgColor: '#ffeef3',
    },
  ]

  return (
    <>
      <CustomCursor />
      {sections.map((section, idx) => (
        <Section
          key={idx}
          title={section.title}
          description={section.description}
          bgColor={section.bgColor}
        />
      ))}
    </>
  )
}
