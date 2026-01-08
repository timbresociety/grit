// Mutable debug object for high-frequency stats (bypassing React state)
export const physicsDebug = {
    cursor: {
        nativeX: 0,
        nativeY: 0,
        renderX: 0,
        renderY: 0,
        deltaX: 0,
        deltaY: 0
    },
    hero: {
        rect: { left: 0, top: 0, width: 0, height: 0 },
        localX: 0,
        localY: 0,
        uvX: 0,
        uvY: 0
    },
    process: {
        start: 0,
        end: 0,
        progress: 0,
        scrollDistance: 0
    },
    scroll: {
        y: 0
    }
}
