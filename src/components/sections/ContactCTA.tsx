"use client"

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { ArrowRight, Mail, Calendar, MessageCircle } from 'lucide-react'

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

export default function ContactCTA() {
    const sectionRef = useRef<HTMLElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(headerRef, { once: true, margin: "-100px" })
    const prefersReducedMotion = useReducedMotion()

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end end"]
    })

    const backgroundOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 0.06])

    return (
        <section
            id="contact"
            ref={sectionRef}
            className="bg-background scroll-mt-32 relative overflow-hidden"
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

            {/* Section Header */}
            <div
                ref={headerRef}
                className="relative z-10 text-center pt-12 md:pt-20 pb-12 md:pb-16 border-b border-border"
            >
                <motion.h2
                    className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground mb-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.1, duration: 0.8 }}
                >
                    Ready to Build?
                </motion.h2>
                <motion.p
                    className="text-lg md:text-xl text-muted max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 }}
                >
                    Let's discuss how we can bring your vision to production.
                    Our team is ready to scope your next project.
                </motion.p>
            </div>

            {/* Contact Options */}
            <div className="relative z-10 container-editorial py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {contactOptions.map((option, i) => (
                        <motion.a
                            key={option.title}
                            href={option.action}
                            target={option.external ? "_blank" : undefined}
                            rel={option.external ? "noopener noreferrer" : undefined}
                            className="panel panel-hover p-6 text-center group"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center mx-auto mb-4 group-hover:border-foreground transition-colors">
                                <option.icon size={20} className="text-accent-jewel" />
                            </div>
                            <h4 className="font-serif text-lg text-foreground mb-1">{option.title}</h4>
                            <p className="text-sm text-muted mb-4">{option.description}</p>
                            <span className="text-sm text-accent-jewel group-hover:text-accent-hover flex items-center justify-center gap-1 transition-colors">
                                {option.actionLabel} <ArrowRight size={14} />
                            </span>
                        </motion.a>
                    ))}
                </div>

                {/* Primary CTA */}
                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                >
                    <a
                        href="https://calendly.com/gritlabsinit"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary inline-flex text-base px-8 py-4"
                    >
                        Start Your Build Sprint <ArrowRight size={18} />
                    </a>
                </motion.div>
            </div>

        </section>
    )
}
