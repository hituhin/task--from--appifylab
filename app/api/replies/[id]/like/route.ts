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

  const existing = await prisma.replyLike.findUnique({
    where: { userId_replyId: { userId, replyId: id } },
  })

  if (existing) {
    await prisma.replyLike.delete({
      where: { userId_replyId: { userId, replyId: id } },
    })
  } else {
    await prisma.replyLike.create({ data: { userId, replyId: id } })
  }

  const count = await prisma.replyLike.count({ where: { replyId: id } })

  return NextResponse.json({ liked: !existing, count })
}
