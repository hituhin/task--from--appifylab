import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sanitizeText } from '@/lib/sanitize'
import { rateLimit } from '@/lib/rateLimit'

const createCommentSchema = z.object({
  postId: z.string().min(1),
  content: z.string().min(1).max(1000),
})

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(ip, 'comment-create', 30)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  const body = await request.json()
  const parsed = createCommentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { postId, content } = parsed.data
  const sanitized = sanitizeText(content)

  const comment = await prisma.comment.create({
    data: {
      content: sanitized,
      postId,
      authorId: session.user.id,
    },
    include: {
      author: { select: { id: true, firstName: true, lastName: true } },
      _count: { select: { likes: true, replies: true } },
      likes: { where: { userId: session.user.id }, select: { userId: true } },
    },
  })

  return NextResponse.json({ comment }, { status: 201 })
}
