import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import FeedPage from '@/components/feed/FeedPage'

export default async function Feed() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

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
    take: 10,
  })

  return (
    <FeedPage
      initialPosts={JSON.parse(JSON.stringify(posts))}
      currentUser={session.user}
    />
  )
}
