"use client"

import { useStore } from '@/store/useStore'
import { useEffect, useRef, useState } from 'react'
import { Activity, MousePointer2, Move, Maximize, GitCommit } from 'lucide-react'
import { physicsDebug } from '@/lib/debug'

export default function DebugPanel() {
    const {
        isScrollLocked,
        isMenuOpen,
        isSmoothScrollEnabled,
        setSmoothScrollEnabled
    } = useStore()

    const [mounted, setMounted] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    // Refs for DOM updates (better performance than state for 60fps)
    const cursorRef = useRef<HTMLPreElement>(null)
    const heroRef = useRef<HTMLPreElement>(null)
    const processRef = useRef<HTMLPreElement>(null)
    const scrollRef = useRef<HTMLPreElement>(null)

    useEffect(() => {
        setMounted(true)
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'd') {
                setIsVisible(prev => !prev)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    useEffect(() => {
        if (!isVisible) return

        let outputRef: number
        const update = () => {
            // Update Cursor Stats
            if (cursorRef.current) {
                const { nativeX, nativeY, renderX, renderY, deltaX, deltaY } = physicsDebug.cursor
                cursorRef.current.innerText = `Native: ${nativeX | 0}, ${nativeY | 0}\nRender: ${renderX | 0}, ${renderY | 0}\nDelta:  ${deltaX.toFixed(2)}, ${deltaY.toFixed(2)}`
            }

            // Update Scroll Stats
            if (scrollRef.current) {
                scrollRef.current.innerText = `ScrollY: ${physicsDebug.scroll.y | 0}`
            }

            // Update Hero Stats
            if (heroRef.current) {
                const { rect, localX, localY, uvX, uvY } = physicsDebug.hero
                heroRef.current.innerText = `Rect: L${rect.left | 0} T${rect.top | 0} W${rect.width | 0} H${rect.height | 0}\nLocal: ${localX | 0}, ${localY | 0}\nUV:    ${uvX.toFixed(3)}, ${uvY.toFixed(3)}`
            }

            // Update Process Stats
            if (processRef.current) {
                const { start, end, progress, scrollDistance } = physicsDebug.process
                processRef.current.innerText = `Dist: ${scrollDistance | 0}px\nStart: ${start | 0} | End: ${end | 0}\nProg:  ${progress.toFixed(3)}`
            }

            outputRef = requestAnimationFrame(update)
        }
        update()

        // Debug Dot
        const dot = document.createElement('div')
        dot.style.cssText = 'position: fixed; width: 4px; height: 4px; background: red; border-radius: 50%; pointer-events: none; z-index: 10000; transform: translate(-50%, -50%);'
        document.body.appendChild(dot)

        const updateDot = () => {
            // Position dot at Hero local projected to screen (for verify)
            if (physicsDebug.hero.rect.width > 0) {
                const screenX = physicsDebug.hero.rect.left + physicsDebug.hero.localX
                const screenY = physicsDebug.hero.rect.top + physicsDebug.hero.localY
                dot.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) translate(-50%, -50%)`
            }
            requestAnimationFrame(updateDot)
        }
        updateDot()

        return () => {
            cancelAnimationFrame(outputRef)
            if (document.body.contains(dot)) document.body.removeChild(dot)
        }
    }, [isVisible])

    if (!mounted || process.env.NODE_ENV === 'production') return null
    if (!isVisible) return null

    return (
        <div className="fixed bottom-4 left-4 z-[99999] bg-black/90 border border-white/20 p-4 rounded-lg text-[10px] font-mono text-neon-blue shadow-2xl backdrop-blur-md w-72 leading-tight">
            <h3 className="uppercase tracking-widest text-white mb-2 font-bold flex items-center justify-between">
                <span><Activity size={12} className="inline mr-1" /> Diagnostics</span>
                <span className="text-[9px] opacity-50 bg-white/10 px-1 rounded">Key: D</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <div className="flex items-center gap-1 text-white/50 mb-1"><MousePointer2 size={10} /> Cursor</div>
                    <pre ref={cursorRef} className="whitespace-pre font-bold text-white"></pre>
                </div>
                <div>
                    <div className="flex items-center gap-1 text-white/50 mb-1"><Move size={10} /> Scroll</div>
                    <pre ref={scrollRef} className="whitespace-pre font-bold text-white"></pre>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex items-center gap-1 text-white/50 mb-1"><Maximize size={10} /> Hero Logic</div>
                <pre ref={heroRef} className="whitespace-pre font-bold text-white"></pre>
            </div>

            <div className="mb-4">
                <div className="flex items-center gap-1 text-white/50 mb-1"><GitCommit size={10} /> Process Pin</div>
                <pre ref={processRef} className="whitespace-pre font-bold text-white"></pre>
            </div>

            <div className="h-px bg-white/10 my-3"></div>

            <div className="space-y-1">
                <div className="flex justify-between gap-2">
                    <span>Locked:</span>
                    <span className={isScrollLocked ? "text-red-500" : "text-green-500"}>
                        {isScrollLocked ? "YES" : "NO"}
                    </span>
                </div>
                <div className="flex justify-between gap-2">
                    <span>Smooth:</span>
                    <button
                        onClick={() => setSmoothScrollEnabled(!isSmoothScrollEnabled)}
                        className={`px-2 rounded border text-[9px] ${isSmoothScrollEnabled
                            ? 'border-green-500/30 text-green-400'
                            : 'border-red-500/30 text-red-400'
                            }`}
                    >
                        {isSmoothScrollEnabled ? 'ON' : 'OFF'}
                    </button>
                </div>
            </div>
        </div>
    )
}
