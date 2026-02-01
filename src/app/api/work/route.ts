import { NextResponse } from 'next/server'
import { getAllWorkPosts } from '@/lib/work'

export async function GET() {
  const posts = getAllWorkPosts()
  return NextResponse.json(posts)
}
