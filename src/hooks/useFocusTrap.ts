import { useEffect, useRef } from 'react'

export function useFocusTrap(isActive: boolean) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!isActive) return

        const container = containerRef.current
        if (!container) return

        const focusableElements = container.querySelectorAll(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )

        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

        // Focus the first element when activated
        if (firstElement) {
            requestAnimationFrame(() => firstElement.focus())
        }

        const handleTabKey = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault()
                    lastElement.focus()
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault()
                    firstElement.focus()
                }
            }
        }

        container.addEventListener('keydown', handleTabKey)
        return () => container.removeEventListener('keydown', handleTabKey)
    }, [isActive])

    return containerRef
}
