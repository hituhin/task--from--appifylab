import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const userId = session.user.id
  const body = await request.json().catch(() => ({}))
  const reactionType: string = body.reactionType ?? 'like'

  const existing = await prisma.postLike.findUnique({
    where: { userId_postId: { userId, postId: id } },
  })

  // verify user exists (stale session guard)
  const userExists = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } })
  if (!userExists) return NextResponse.json({ error: 'User not found' }, { status: 401 })

  if (existing) {
    if (existing.reactionType === reactionType) {
      // same reaction → toggle off
      await prisma.postLike.delete({ where: { userId_postId: { userId, postId: id } } })
      const count = await prisma.postLike.count({ where: { postId: id } })
      return NextResponse.json({ liked: false, count, reactionType: null })
    } else {
      // different reaction → update
      await prisma.postLike.update({
        where: { userId_postId: { userId, postId: id } },
        data: { reactionType },
      })
      const count = await prisma.postLike.count({ where: { postId: id } })
      return NextResponse.json({ liked: true, count, reactionType })
    }
  } else {
    await prisma.postLike.create({ data: { userId, postId: id, reactionType } })
    const count = await prisma.postLike.count({ where: { postId: id } })
    return NextResponse.json({ liked: true, count, reactionType })
  }
}
