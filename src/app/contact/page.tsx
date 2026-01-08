"use client"

import { motion } from 'framer-motion'
import { Calendar, ArrowRight, Mail } from 'lucide-react'

export default function Contact() {
    return (
        <section className="min-h-screen bg-[#050505] text-white pt-32 pb-24 px-6 flex flex-col justify-center">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

                    {/* Left: Heading & Info */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="text-neon-blue uppercase tracking-[0.2em] text-xs font-semibold">
                                Get in Touch
                            </span>
                            <h1 className="text-6xl md:text-8xl font-serif font-bold mt-4 mb-8 leading-none">
                                Let's<br />Build.
                            </h1>
                            <p className="text-xl text-white/60 font-light max-w-md leading-relaxed mb-12">
                                We accept a limited number of engagements per quarter to ensure maximum focus. Tell us what you're building.
                            </p>

                            <div className="space-y-6">
                                <a href="mailto:hello@grit.cool" className="flex items-center gap-4 text-xl hover:text-neon-blue transition-colors group">
                                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-neon-blue transition-colors">
                                        <Mail size={20} />
                                    </div>
                                    hello@grit.cool
                                </a>
                                <a href="#" className="flex items-center gap-4 text-xl hover:text-neon-blue transition-colors group">
                                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-neon-blue transition-colors">
                                        <Calendar size={20} />
                                    </div>
                                    Book an Intro Call
                                </a>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-2xl"
                    >
                        <form className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-white/40">Name</label>
                                    <input type="text" className="w-full bg-transparent border-b border-white/20 py-4 focus:outline-none focus:border-neon-blue transition-colors text-lg" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-white/40">Email</label>
                                    <input type="email" className="w-full bg-transparent border-b border-white/20 py-4 focus:outline-none focus:border-neon-blue transition-colors text-lg" placeholder="john@company.com" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/40">Company / Project</label>
                                <input type="text" className="w-full bg-transparent border-b border-white/20 py-4 focus:outline-none focus:border-neon-blue transition-colors text-lg" placeholder="Grit Labs" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/40">What do you need?</label>
                                <textarea rows={3} className="w-full bg-transparent border-b border-white/20 py-4 focus:outline-none focus:border-neon-blue transition-colors text-lg resize-none" placeholder="Brief description of the project..." />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/40">Timeline</label>
                                <select className="w-full bg-transparent border-b border-white/20 py-4 focus:outline-none focus:border-neon-blue transition-colors text-lg text-white/70">
                                    <option className="bg-neutral-900">Immediate</option>
                                    <option className="bg-neutral-900">1-3 Months</option>
                                    <option className="bg-neutral-900">3+ Months</option>
                                </select>
                            </div>

                            <button className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 hover:bg-neon-blue transition-colors mt-8 flex items-center justify-center gap-2">
                                Send Request <ArrowRight size={18} />
                            </button>
                        </form>
                    </motion.div>

                </div>
            </div>
        </section>
    )
}
