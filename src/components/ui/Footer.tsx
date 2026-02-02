"use client"

import Link from 'next/link'

const socialLinks = [
    { label: 'Twitter', href: 'https://x.com/gritlabsinit' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/grit-labs-inc' },
    { label: 'GitHub', href: 'https://github.com/gritlabsinit' },
]

const navLinks = [
    { label: 'Work', href: '/work' },
    { label: 'Explore A Build Sprint', href: 'https://calendly.com/gritlabsinit', external: true },
]

export default function Footer() {
    return (
        <footer className="bg-white text-foreground py-16">
            <div className="container-editorial">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16">

                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <img
                                src="/images/logo.png"
                                alt="GRIT Labs"
                                width={28}
                                height={28}
                                className="brightness-0"
                            />
                            <span className="text-2xl font-medium tracking-tight" style={{ fontFamily: 'var(--font-pp-mondwest)' }}>GRIT Labs</span>
                        </Link>
                        <p className="mt-4 text-muted text-sm leading-relaxed max-w-xs">
                            Engineered to Endure. We build bespoke AI and Blockchain software for teams that think long term.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <span className="text-xs font-medium tracking-widest uppercase text-muted block mb-4">
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
                                            className="text-sm text-muted hover:text-foreground transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted hover:text-foreground transition-colors"
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
                        <span className="text-xs font-medium tracking-widest uppercase text-muted block mb-4">
                            Connect
                        </span>
                        <a
                            href="mailto:timbre@grit.cool"
                            className="text-sm text-muted hover:text-foreground transition-colors block mb-4"
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
                                        className="text-sm text-muted hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <span className="text-xs text-muted">
                        © {new Date().getFullYear()} Grit Labs Inc. All rights reserved.
                    </span>
                    <span className="text-xs text-muted">
                        Built with precision.
                    </span>
                </div>

            </div>
        </footer>
    )
}
