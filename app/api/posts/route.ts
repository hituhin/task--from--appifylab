import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sanitizeText } from '@/lib/sanitize'
import { rateLimit } from '@/lib/rateLimit'

const createPostSchema = z.object({
  content: z.string().min(1, 'Content is required').max(2000, 'Content too long'),
  imageUrl: z.string().optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).default('PUBLIC'),
})

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const cursor = searchParams.get('cursor')
  const limit = Math.min(Number(searchParams.get('limit') ?? '10'), 50)

  const posts = await prisma.post.findMany({
    where: {
      OR: [{ visibility: 'PUBLIC' }, { authorId: session.user.id }],
    },
    include: {
      author: { select: { id: true, firstName: true, lastName: true } },
      _count: { select: { likes: true, comments: true } },
      likes: { where: { userId: session.user.id }, select: { userId: true, reactionType: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  })

  let nextCursor: string | null = null
  if (posts.length > limit) {
    const nextPost = posts.pop()
    nextCursor = nextPost!.id
  }

  return NextResponse.json({ posts, nextCursor })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(ip, 'post-create', 20)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  const body = await request.json()
  const parsed = createPostSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { content, imageUrl, visibility } = parsed.data
  const sanitized = sanitizeText(content)

  const post = await prisma.post.create({
    data: {
      content: sanitized,
      imageUrl: imageUrl ?? null,
      visibility,
      authorId: session.user.id,
    },
    include: {
      author: { select: { id: true, firstName: true, lastName: true } },
      _count: { select: { likes: true, comments: true } },
      likes: { where: { userId: session.user.id }, select: { userId: true, reactionType: true } },
    },
  })

  return NextResponse.json({ post }, { status: 201 })
}
