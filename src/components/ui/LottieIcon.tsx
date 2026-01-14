"use client"

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

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

    useEffect(() => {
        fetch(src)
            .then(res => res.json())
            .then(data => setAnimationData(data))
            .catch(err => console.error('Failed to load Lottie animation:', err))
    }, [src])

    if (!animationData) {
        return <div className={`${className} animate-pulse bg-white/10 rounded`} />
    }

    return (
        <Lottie
            animationData={animationData}
            loop={loop}
            autoplay={autoplay}
            className={className}
        />
    )
}
