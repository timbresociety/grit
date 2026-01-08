"use client"

import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { CheckCircle2 } from 'lucide-react'
import { physicsDebug } from '@/lib/debug'

interface Phase {
    id: number
    title: string
    duration: string
    deliverables: string[]
    why: string
}

const phases: Phase[] = [
    {
        id: 1,
        title: "Scoping & Discovery",
        duration: "Week 1",
        deliverables: ["Product Requirements Doc", "Technical Feasibility Report", "User Stories"],
        why: "Aligns stakeholders and eliminates scope creep before a single line of code is written."
    },
    {
        id: 2,
        title: "Architecture & Design",
        duration: "Week 2",
        deliverables: ["System Architecture Diagram", "Figma Prototypes", "Smart Contract Specs"],
        why: "Blueprints the entire system to ensure scalability and security from day one."
    },
    {
        id: 3,
        title: "Development & Integrations",
        duration: "Weeks 3–9",
        deliverables: ["Frontend Implementation", "Smart Contract Deployment (Testnet)", "API Integrations"],
        why: "Rapid, agile sprints delivering testable increments of the final product."
    },
    {
        id: 4,
        title: "UAT & Security Audits",
        duration: "Weeks 10–11",
        deliverables: ["Audit Reports", "Penetration Testing", "User Acceptance Sign-off"],
        why: "Rigorous verification to guarantee zero-day exploit protection and user satisfaction."
    },
    {
        id: 5,
        title: "Handover & Training",
        duration: "Week 12",
        deliverables: ["Source Code Transfer", "Runbooks & Documentation", "Admin Training"],
        why: "Empowers your internal team to own, operate, and scale the platform independently."
    }
]

export default function Process() {
    const sectionRef = useRef<HTMLElement>(null)
    const pinWrapRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const [activePhase, setActivePhase] = useState(0)

    useGSAP(() => {
        const mm = gsap.matchMedia()

        mm.add("(min-width: 768px)", () => {
            const track = trackRef.current
            const section = sectionRef.current
            const pinWrap = pinWrapRef.current

            if (!track || !section || !pinWrap) return

            // 1. Precise Measurement
            const setup = () => {
                const scrollWidth = track.scrollWidth
                const viewportWidth = window.innerWidth
                const scrollDistance = scrollWidth - viewportWidth

                // Set precise height of the spacer section
                // This forces the timeline to take exactly this much scroll space
                const totalHeight = scrollDistance + window.innerHeight
                section.style.height = `${totalHeight}px`

                physicsDebug.process.scrollDistance = scrollDistance
                return scrollDistance
            }

            let dist = setup()

            // 2. Observer for Resize
            // We re-run setup on resize and refresh ScrollTrigger
            const observer = new ResizeObserver(() => {
                dist = setup()
                ScrollTrigger.refresh()
            })
            observer.observe(track)

            // 3. ScrollTrigger Interaction
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: pinWrap, // Pin the wrapper
                    pin: true,
                    scrub: 1, // Smooth scrub
                    start: "top top",
                    end: () => `+=${dist}`, // End exactly when distance is consumed
                    invalidateOnRefresh: true,
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        physicsDebug.process.start = self.start
                        physicsDebug.process.end = self.end
                        physicsDebug.process.progress = self.progress

                        const index = Math.min(
                            Math.floor(self.progress * phases.length),
                            phases.length - 1
                        )
                        setActivePhase(index)
                    }
                }
            })

            tl.to(track, {
                x: () => -dist,
                ease: "none"
            })

            return () => observer.disconnect()
        })

    }, { scope: sectionRef })

    return (
        <section ref={sectionRef} id="process" className="relative bg-[#050505] text-white">

            {/* Pinned Wrapper */}
            <div ref={pinWrapRef} className="w-full h-screen overflow-hidden relative flex flex-col justify-center">

                {/* Background Ambience */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#050505] to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent"></div>
                </div>

                {/* Sticky Header / Progress (Desktop) */}
                <div className="hidden md:block absolute top-12 left-12 z-20">
                    <div className="text-neon-blue uppercase tracking-[0.2em] text-xs font-semibold mb-2">
                        The Process
                    </div>
                    <h2 className="text-4xl font-serif font-bold mb-8">
                        Build Sprint
                    </h2>

                    <div className="bg-white/5 backdrop-blur border border-white/10 p-6 rounded-xl w-[320px]">
                        <div className="text-xs text-white/50 uppercase tracking-widest mb-2">
                            Current Phase
                        </div>
                        <div className="text-xl font-bold font-serif mb-1">
                            {phases[activePhase].title}
                        </div>
                        <div className="text-neon-blue text-sm mb-4">
                            {phases[activePhase].duration}
                        </div>
                        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                            <div
                                className="bg-neon-blue h-full transition-all duration-300 ease-out"
                                style={{ width: `${((activePhase + 1) / phases.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Horizontal Track */}
                <div ref={trackRef} className="flex flex-col md:flex-row md:items-center px-6 md:px-0 md:pl-[40vw] gap-12 md:gap-0 will-change-transform">
                    {phases.map((phase, i) => (
                        <div
                            key={phase.id}
                            className="process-station w-full md:w-[60vw] md:flex-shrink-0 relative group px-4 md:px-12"
                        >
                            {/* Connector Line (Desktop) */}
                            {i !== phases.length - 1 && (
                                <div className="hidden md:block absolute top-[50%] right-[-50%] w-full h-[2px] bg-gradient-to-r from-neon-blue/50 to-transparent z-0"></div>
                            )}

                            {/* Marble Plinth Card */}
                            <div className="relative z-10 bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/10 p-8 md:p-12 rounded-lg shadow-2xl overflow-hidden group-hover:border-neon-blue/30 transition-colors duration-500">
                                {/* Chrome Rail Accents */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                                {/* Content */}
                                <div className="flex flex-col gap-6">
                                    <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
                                        <div className="text-neon-blue font-mono text-sm uppercase tracking-widest">
                                            Phase {phase.id.toString().padStart(2, '0')}
                                        </div>
                                        <div className="text-white/40 font-serif italic">
                                            {phase.duration}
                                        </div>
                                    </div>

                                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight">
                                        {phase.title}
                                    </h3>

                                    <p className="text-sm md:text-base text-gray-400 font-light border-l-2 border-neon-blue pl-4">
                                        {phase.why}
                                    </p>

                                    <div className="mt-4">
                                        <div className="text-xs text-white/30 uppercase tracking-widest mb-3">Deliverables</div>
                                        <ul className="space-y-2">
                                            {phase.deliverables.map((d, j) => (
                                                <li key={j} className="flex items-center gap-3 text-sm text-gray-300">
                                                    <CheckCircle2 size={16} className="text-neon-blue flex-shrink-0" />
                                                    {d}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* End Spacer */}
                    <div className="hidden md:block w-[20vw] flex-shrink-0"></div>
                </div>
            </div>
        </section>
    )
}
