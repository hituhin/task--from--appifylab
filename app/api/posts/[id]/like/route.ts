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

  const existing = await prisma.postLike.findUnique({
    where: { userId_postId: { userId, postId: id } },
  })

  if (existing) {
    await prisma.postLike.delete({
      where: { userId_postId: { userId, postId: id } },
    })
  } else {
    await prisma.postLike.create({ data: { userId, postId: id } })
  }

  const count = await prisma.postLike.count({ where: { postId: id } })

  return NextResponse.json({ liked: !existing, count })
}
