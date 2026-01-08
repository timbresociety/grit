"use client"

import React from 'react'
import CyberBust from './CyberBust'
import MarbleBust from './MarbleBust'

export default function LiquidBust({ mouseRef, isHovering }: { mouseRef?: React.MutableRefObject<{ x: number, y: number }>, isHovering?: boolean }) {
    return (
        <group dispose={null}>
            {/* Draw Cyber FIRST (Background layer) - Scale 1.20 */}
            <CyberBust isHovering={isHovering} mouseRef={mouseRef} />

            {/* Draw Marble SECOND (Foreground layer with hole) - Scale 1.50 */}
            <MarbleBust mouseRef={mouseRef} isHovering={isHovering} />
        </group>
    )
}
