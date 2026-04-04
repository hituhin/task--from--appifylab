import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const userId = session.user.id

  const existing = await prisma.commentLike.findUnique({
    where: { userId_commentId: { userId, commentId: id } },
  })

  if (existing) {
    await prisma.commentLike.delete({
      where: { userId_commentId: { userId, commentId: id } },
    })
  } else {
    await prisma.commentLike.create({ data: { userId, commentId: id } })
  }

  const count = await prisma.commentLike.count({ where: { commentId: id } })

  return NextResponse.json({ liked: !existing, count })
}
