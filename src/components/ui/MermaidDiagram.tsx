'use client'

import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

// Initialize mermaid with dark theme
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#1E3A5F',
    primaryTextColor: '#FAF9F7',
    primaryBorderColor: '#C17F59',
    lineColor: '#6B7280',
    sectionBkgColor: '#1A1A1A',
    altSectionBkgColor: '#2D2D2D',
    tertiaryColor: '#0F0F0F',
  },
})

export function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const renderChart = async () => {
      if (!ref.current) return
      try {
        const id = `mermaid-${Math.random().toString(36).substring(7)}`
        const { svg } = await mermaid.render(id, chart)
        setSvg(svg)
        setError(null)
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError('Failed to render diagram')
      }
    }
    renderChart()
  }, [chart])

  if (error) {
    return (
      <div className="my-8 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
        {error}
        <pre className="mt-2 text-xs text-white/50 overflow-x-auto">{chart}</pre>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className="my-8 flex justify-center overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
