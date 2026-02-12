"use client"

import dynamic from 'next/dynamic'
import { useEffect, useState, useRef } from 'react'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

interface LottieIconProps {
    src: string
    className?: string
    loop?: boolean
    autoplay?: boolean
}

export default function LottieIcon({
    src,
    className = "",
    loop = true,
    autoplay = true
}: LottieIconProps) {
    const [animationData, setAnimationData] = useState<object | null>(null)
    const [isInView, setIsInView] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Only fetch the Lottie JSON when the component is near the viewport
    useEffect(() => {
        if (!containerRef.current) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsInView(true)
                    observer.disconnect()
                }
            },
            { rootMargin: '200px' } // Start loading 200px before entering viewport
        )

        observer.observe(containerRef.current)

        return () => observer.disconnect()
    }, [])

    // Fetch animation data only when in view
    useEffect(() => {
        if (!isInView) return

        fetch(src)
            .then(res => res.json())
            .then(data => setAnimationData(data))
            .catch(err => console.error('Failed to load Lottie animation:', err))
    }, [src, isInView])

    if (!animationData) {
        return <div ref={containerRef} className={`${className} animate-pulse bg-white/10 rounded`} />
    }

    return (
        <div ref={containerRef}>
            <Lottie
                animationData={animationData}
                loop={loop}
                autoplay={autoplay}
                className={className}
                style={{
                    filter: 'invert(1)',
                }}
            />
        </div>
    )
}
