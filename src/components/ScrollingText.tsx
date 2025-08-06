"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface ScrollingTextProps {
  text: string
  className?: string
  speed?: number // Speed in pixels per second
  pauseDuration?: number // Pause duration at start/end in milliseconds
}

export function ScrollingText({
  text,
  className,
  speed = 30,
  pauseDuration = 1500
}: ScrollingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [shouldScroll, setShouldScroll] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        // Create a temporary element to measure just the text without duplicates
        const tempElement = document.createElement('div')
        tempElement.style.position = 'absolute'
        tempElement.style.visibility = 'hidden'
        tempElement.style.whiteSpace = 'nowrap'
        tempElement.style.font = window.getComputedStyle(textRef.current).font
        tempElement.textContent = text
        document.body.appendChild(tempElement)
        const actualTextWidth = tempElement.offsetWidth
        document.body.removeChild(tempElement)

        setShouldScroll(actualTextWidth > containerWidth)
        setScrollPosition(0)
        setIsScrolling(false)
      }
    }

    checkOverflow()

    // Recheck on window resize
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [text])

  useEffect(() => {
    if (!shouldScroll || !containerRef.current || !textRef.current) return

    const container = containerRef.current
    // Calculate the actual text width using the same method as overflow check
    const tempElement = document.createElement('div')
    tempElement.style.position = 'absolute'
    tempElement.style.visibility = 'hidden'
    tempElement.style.whiteSpace = 'nowrap'
    tempElement.style.font = window.getComputedStyle(textRef.current).font
    tempElement.textContent = text
    document.body.appendChild(tempElement)
    const textWidth = tempElement.offsetWidth
    document.body.removeChild(tempElement)

    // Only use the actual text width plus a small gap for seamless looping
    const totalDistance = textWidth + 32 // 32px gap between repetitions

    let animationId: number
    let startTime: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime

      // Initial pause before starting
      if (currentTime - startTime < pauseDuration) {
        animationId = requestAnimationFrame(animate)
        return
      }

      // Calculate continuous scroll position
      const elapsed = currentTime - startTime - pauseDuration
      const distance = (elapsed / 1000) * speed
      const position = distance % totalDistance

      setScrollPosition(position)
      setIsScrolling(true)
      animationId = requestAnimationFrame(animate)
    }

    // Start animation after a brief delay
    const timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(animate)
    }, 500)

    return () => {
      clearTimeout(timeoutId)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [shouldScroll, speed, pauseDuration, text])

  if (!shouldScroll) {
    return (
      <div ref={containerRef} className={cn("overflow-hidden", className)}>
        <div ref={textRef} className="whitespace-nowrap">
          {text}
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={cn("overflow-hidden", className)}>
      <div
        ref={textRef}
        className="whitespace-nowrap"
        style={{
          transform: `translateX(-${scrollPosition}px)`,
        }}
      >
        {text}
        {/* Add a gap and duplicate text for seamless looping */}
        <span className="inline-block w-8"></span>
        {text}
      </div>
    </div>
  )
}
