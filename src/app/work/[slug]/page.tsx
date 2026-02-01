import { getWorkSlugs } from '@/lib/work'
import { notFound } from 'next/navigation'

// Generate static params for all slugs
export function generateStaticParams() {
  const slugs = getWorkSlugs()
  return slugs.map((slug) => ({ slug }))
}

// Disable dynamic routes - only pre-generated slugs are valid
export const dynamicParams = false

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function WorkPage({ params }: PageProps) {
  const { slug } = await params

  try {
    // Dynamically import the MDX file
    const { default: Post, frontmatter } = await import(`@/work/${slug}.mdx`)
    return <Post />
  } catch (error) {
    console.error('Error loading work post:', error)
    notFound()
  }
}

// Generate metadata for each page
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params

  try {
    const { frontmatter } = await import(`@/work/${slug}.mdx`)
    return {
      title: `${frontmatter.title} | Grit Labs`,
      description: frontmatter.title,
    }
  } catch {
    return {
      title: 'Case Study | Grit Labs',
    }
  }
}
