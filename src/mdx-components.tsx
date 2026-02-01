import type { MDXComponents } from 'mdx/types'
import { MermaidDiagram } from './components/ui/MermaidDiagram'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headings with editorial typography
    h1: ({ children }) => (
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 mt-12 first:mt-0 leading-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4 mt-10 pb-2 border-b border-white/10">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl md:text-2xl font-serif font-semibold text-white mb-3 mt-8">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-serif font-semibold text-white/90 mb-2 mt-6">
        {children}
      </h4>
    ),

    // Paragraphs
    p: ({ children }) => (
      <p className="text-white/70 leading-relaxed mb-4 font-light">
        {children}
      </p>
    ),

    // Lists
    ul: ({ children }) => (
      <ul className="list-disc list-outside ml-6 mb-4 space-y-2 text-white/70 font-light">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-outside ml-6 mb-4 space-y-2 text-white/70 font-light">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="leading-relaxed pl-1">{children}</li>
    ),

    // Links
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-[#4A9EE0] hover:text-[#6BB5F0] underline underline-offset-2 transition-colors"
      >
        {children}
      </a>
    ),

    // Blockquotes
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#C17F59] pl-4 my-6 italic text-white/60">
        {children}
      </blockquote>
    ),

    // Horizontal rule
    hr: () => (
      <hr className="border-none h-px bg-white/10 my-12" />
    ),

    // Strong and emphasis
    strong: ({ children }) => (
      <strong className="font-semibold text-white">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-white/80">{children}</em>
    ),

    // Code blocks and inline code
    code: ({ children, className }) => {
      // Check if this is a code block (has language class)
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : null

      if (language === 'mermaid') {
        return <MermaidDiagram chart={String(children).trim()} />
      }

      // Inline code (no language class)
      if (!className) {
        return (
          <code className="bg-white/10 px-1.5 py-0.5 rounded text-[#4A9EE0] text-sm font-mono">
            {children}
          </code>
        )
      }

      // Code block
      return (
        <code className={`${className} block`}>
          {children}
        </code>
      )
    },
    pre: ({ children }) => (
      <pre className="bg-[#0A0A0A] border border-white/10 rounded-lg p-4 my-6 overflow-x-auto text-sm font-mono text-white/80">
        {children}
      </pre>
    ),

    // Tables
    table: ({ children }) => (
      <div className="overflow-x-auto my-8">
        <table className="w-full border-collapse text-sm">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="border-b border-white/20">{children}</thead>
    ),
    tbody: ({ children }) => (
      <tbody className="divide-y divide-white/10">{children}</tbody>
    ),
    tr: ({ children }) => (
      <tr className="hover:bg-white/5 transition-colors">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="text-left p-3 font-semibold text-white/90 bg-white/5">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="p-3 text-white/70 font-light">{children}</td>
    ),

    // Custom wrapper for the entire MDX content
    wrapper: ({ children }) => (
      <article className="prose-custom max-w-none">
        {children}
      </article>
    ),

    ...components,
  }
}
