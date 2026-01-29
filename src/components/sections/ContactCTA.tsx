"use client"

import { useRef, useEffect, useState } from 'react'
import { motion, useInView, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { ArrowRight, Mail, Calendar, MessageCircle } from 'lucide-react'
import { SECTION_FRAME_MAP, TOTAL_FRAMES } from '@/components/ui/ScrollVideoBackground'

const contactOptions = [
    {
        icon: Calendar,
        title: "Book a Call",
        description: "Schedule a 30-minute discovery call",
        action: "https://calendly.com/gritlabsinit",
        actionLabel: "Schedule Now",
        external: true
    },
    {
        icon: Mail,
        title: "Email Us",
        description: "Get in touch directly",
        action: "mailto:timbre@grit.cool",
        actionLabel: "Send Email",
        external: false
    },
    {
        icon: MessageCircle,
        title: "Quick Chat",
        description: "Connect on Twitter/X",
        action: "https://x.com/gritlabsinit",
        actionLabel: "Message Us",
        external: true
    }
]

import { useSectionInView } from '@/components/ui/EditorialLayout'

export default function ContactCTA() {
    // sectionRef for scroll progress (animation)
    const scrollRef = useRef<HTMLElement>(null)
    // viewRef for navigation tracking
    const viewRef = useSectionInView('contact')

    const headerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(headerRef, { once: true, margin: "-100px" })
    const prefersReducedMotion = useReducedMotion()

    // Strict Sync: Use Global Scroll Progress
    const { scrollYProgress: globalScroll } = useScroll()

    // Normalized start point (0 to 1)
    const startPoint = SECTION_FRAME_MAP.contact.start / TOTAL_FRAMES

    // Fade in and stay visible
    const sectionOpacity = useTransform(
        globalScroll,
        [startPoint - 0.02, startPoint],
        [0, 1]
    )

    const { scrollYProgress } = useScroll({
        target: scrollRef,
        offset: ["start end", "end end"]
    })

    const backgroundOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 0.06])

    return (
        <motion.section
            id="contact"
            ref={(el) => {
                if (scrollRef) (scrollRef as React.MutableRefObject<HTMLElement | null>).current = el
                if (viewRef) (viewRef as React.MutableRefObject<HTMLElement | null>).current = el
            }}
            className="editorial-section scroll-mt-32 relative overflow-hidden"
            style={{ opacity: sectionOpacity }}
        >
            {/* Background Pattern */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ opacity: prefersReducedMotion ? 0.06 : backgroundOpacity }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
              radial-gradient(ellipse at 30% 50%, rgba(30, 58, 95, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 50%, rgba(193, 127, 89, 0.2) 0%, transparent 50%)
            `
                    }}
                />
            </motion.div>

            {/* Centered Content Container */}
            <div className="relative z-10 w-full h-full min-h-[60vh] flex flex-col items-center justify-center gap-8">

                {/* Section Header */}
                <div
                    ref={headerRef}
                    className="text-center"
                >
                    <motion.div
                        className="glass-panel-dark px-8 py-6 md:px-12 md:py-8 inline-block"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.1, duration: 0.8 }}
                    >
                        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white mb-4">
                            Ready to Build?
                        </h2>
                        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                            Let's discuss how we can bring your vision to production.
                            Our team is ready to scope your next project.
                        </p>
                    </motion.div>
                </div>

                {/* Primary CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <a
                        href="https://calendly.com/gritlabsinit"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary inline-flex text-base px-8 py-4 "
                    >
                        Start Your Build Sprint <ArrowRight size={18} />
                    </a>
                </motion.div>

            </div>

        </motion.section>
    )
}
