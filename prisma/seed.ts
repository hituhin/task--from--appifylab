import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create fake users
  const password = await bcrypt.hash('password123', 12)

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'steve@example.com' },
      update: {},
      create: { firstName: 'Steve', lastName: 'Jobs', email: 'steve@example.com', password },
    }),
    prisma.user.upsert({
      where: { email: 'ryan@example.com' },
      update: {},
      create: { firstName: 'Ryan', lastName: 'Roslansky', email: 'ryan@example.com', password },
    }),
    prisma.user.upsert({
      where: { email: 'karim@example.com' },
      update: {},
      create: { firstName: 'Karim', lastName: 'Saif', email: 'karim@example.com', password },
    }),
    prisma.user.upsert({
      where: { email: 'emma@example.com' },
      update: {},
      create: { firstName: 'Emma', lastName: 'Wilson', email: 'emma@example.com', password },
    }),
  ])

  const [steve, ryan, karim, emma] = users

  // Create posts with images and text
  const post1 = await prisma.post.create({
    data: {
      content: 'Just launched our new Healthy Tracking App! Excited to share this with everyone. Check it out! 🚀',
      imageUrl: '/assets/images/timeline_img.png',
      visibility: 'PUBLIC',
      authorId: karim.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
    },
  })

  const post2 = await prisma.post.create({
    data: {
      content: 'Design is not just what it looks like and feels like. Design is how it works. — Steve Jobs',
      imageUrl: null,
      visibility: 'PUBLIC',
      authorId: steve.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    },
  })

  const post3 = await prisma.post.create({
    data: {
      content: 'Big announcement: LinkedIn has reached 1 billion members worldwide! Thank you all for being part of this incredible journey.',
      imageUrl: '/assets/images/profile-cover-img.png',
      visibility: 'PUBLIC',
      authorId: ryan.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    },
  })

  const post4 = await prisma.post.create({
    data: {
      content: 'Working on some exciting new features this week. Stay tuned for updates! The team is doing an amazing job.',
      imageUrl: null,
      visibility: 'PUBLIC',
      authorId: emma.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    },
  })

  const post5 = await prisma.post.create({
    data: {
      content: 'Private journal: Today was a productive day. Shipped 3 features and fixed 5 bugs. 💪',
      imageUrl: null,
      visibility: 'PRIVATE',
      authorId: karim.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    },
  })

  // Add likes to posts
  await prisma.postLike.createMany({
    data: [
      { userId: steve.id, postId: post1.id },
      { userId: ryan.id, postId: post1.id },
      { userId: emma.id, postId: post1.id },
      { userId: karim.id, postId: post2.id },
      { userId: ryan.id, postId: post2.id },
      { userId: steve.id, postId: post3.id },
      { userId: karim.id, postId: post3.id },
      { userId: emma.id, postId: post3.id },
      { userId: ryan.id, postId: post4.id },
    ],
    skipDuplicates: true,
  })

  // Add comments to post1
  const comment1 = await prisma.comment.create({
    data: {
      content: 'This looks amazing! Congratulations on the launch, Karim! 🎉',
      authorId: steve.id,
      postId: post1.id,
    },
  })

  const comment2 = await prisma.comment.create({
    data: {
      content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
      authorId: ryan.id,
      postId: post1.id,
    },
  })

  const comment3 = await prisma.comment.create({
    data: {
      content: 'Been waiting for this! The UI looks super clean. How did you build it?',
      authorId: emma.id,
      postId: post1.id,
    },
  })

  // Add comments to post2
  const comment4 = await prisma.comment.create({
    data: {
      content: 'One of my all-time favourite quotes. Design thinking changes everything.',
      authorId: ryan.id,
      postId: post2.id,
    },
  })

  const comment5 = await prisma.comment.create({
    data: {
      content: 'This is exactly what I needed to hear today. Thanks for sharing!',
      authorId: emma.id,
      postId: post2.id,
    },
  })

  // Add comments to post3
  const comment6 = await prisma.comment.create({
    data: {
      content: 'Wow, 1 billion! That is an insane milestone. Congrats to the whole LinkedIn team! 🙌',
      authorId: karim.id,
      postId: post3.id,
    },
  })

  // Add replies
  await prisma.reply.create({
    data: {
      content: 'Thank you so much Steve! Built it with React Native and Node.js 🙏',
      authorId: karim.id,
      commentId: comment1.id,
    },
  })

  await prisma.reply.create({
    data: {
      content: 'I agree! The attention to detail is incredible.',
      authorId: emma.id,
      commentId: comment1.id,
    },
  })

  await prisma.reply.create({
    data: {
      content: 'Totally agree with this! The best designs are always intuitive.',
      authorId: karim.id,
      commentId: comment4.id,
    },
  })

  // Add likes to comments
  await prisma.commentLike.createMany({
    data: [
      { userId: karim.id, commentId: comment1.id },
      { userId: emma.id, commentId: comment1.id },
      { userId: ryan.id, commentId: comment2.id },
      { userId: steve.id, commentId: comment4.id },
      { userId: karim.id, commentId: comment5.id },
      { userId: steve.id, commentId: comment6.id },
      { userId: ryan.id, commentId: comment6.id },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Seed complete!')
  console.log(`Created ${users.length} users, 5 posts, 6 comments, 3 replies`)
  console.log('\nTest accounts (password: password123):')
  users.forEach(u => console.log(`  ${u.email}`))
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
