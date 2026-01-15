"use client"

import Link from 'next/link'

const socialLinks = [
    { label: 'Twitter', href: 'https://x.com/gritlabsinit' },
    { label: 'LinkedIn', href: 'https://linkedin.com/company/gritlabs' },
    { label: 'GitHub', href: 'https://github.com/gritlabs' },
]

const navLinks = [
    { label: 'Work', href: '/work' },
    { label: 'Book a Call', href: 'https://calendly.com/gritlabsinit', external: true },
]

export default function Footer() {
    return (
        <footer className="bg-foreground text-background py-16">
            <div className="container-editorial">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16">

                    {/* Brand */}
                    <div>
                        <Link href="/" className="font-serif text-2xl font-medium tracking-tight">
                            Grit Labs
                        </Link>
                        <p className="mt-4 text-background/60 text-sm leading-relaxed max-w-xs">
                            Precision engineering for teams that think long term.
                            Enterprise AI and Blockchain infrastructure.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <span className="text-xs font-medium tracking-widest uppercase text-background/40 block mb-4">
                            Navigation
                        </span>
                        <ul className="space-y-3">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    {link.external ? (
                                        <a
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-background/70 hover:text-background transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            className="text-sm text-background/70 hover:text-background transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Social */}
                    <div>
                        <span className="text-xs font-medium tracking-widest uppercase text-background/40 block mb-4">
                            Connect
                        </span>
                        <a
                            href="mailto:timbre@grit.cool"
                            className="text-sm text-background/70 hover:text-background transition-colors block mb-4"
                        >
                            timbre@grit.cool
                        </a>
                        <ul className="flex gap-4">
                            {socialLinks.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-background/50 hover:text-background transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <span className="text-xs text-background/40">
                        © {new Date().getFullYear()} Grit Labs Inc. All rights reserved.
                    </span>
                    <span className="text-xs text-background/40">
                        Built with precision.
                    </span>
                </div>

            </div>
        </footer>
    )
}
