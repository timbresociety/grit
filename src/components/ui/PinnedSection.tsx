"use client"

import { ReactNode } from 'react'
import { SECTION_FRAME_MAP, getSectionScrollHeight } from './ScrollVideoBackground'

type SectionId = keyof typeof SECTION_FRAME_MAP

interface PinnedSectionProps {
    children: ReactNode
    sectionId: SectionId
    className?: string
    id?: string
    dataSection?: string
    /**
     * If true (default), pins the content while scrolling through the section.
     * If false, just adds scroll height without pinning (for sections with their own sticky content).
     */
    pinContent?: boolean
    /**
     * Z-index for stacking order. Higher values appear on top.
     * Earlier sections should have higher z-index than later sections.
     */
    zIndex?: number
}

/**
 * Wrapper component that manages scroll height and pins content using CSS sticky
 * during the frame range for the given section.
 */
export default function PinnedSection({
    children,
    sectionId,
    className = '',
    id,
    dataSection,
    pinContent = true,
    zIndex = 10
}: PinnedSectionProps) {
    const scrollHeight = getSectionScrollHeight(sectionId)

    return (
        <div
            id={id}
            data-section={dataSection}
            className={`relative ${className}`}
            style={{ minHeight: scrollHeight, zIndex }}
        >
            {pinContent ? (
                // Sticky content - stays at top while container scrolls
                <div
                    className="sticky top-0 w-full"
                    style={{ height: '100vh', zIndex: zIndex + 1 }}
                >
                    <div className="h-full overflow-hidden">
                        {children}
                    </div>
                </div>
            ) : (
                // Non-pinned content - flows normally (for sections with internal sticky)
                <div className="w-full" style={{ position: 'relative', zIndex }}>
                    {children}
                </div>
            )}
        </div>
    )
}
