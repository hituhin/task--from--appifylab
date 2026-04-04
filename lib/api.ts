export interface CreatePostData {
  content: string
  imageUrl?: string
  visibility: 'PUBLIC' | 'PRIVATE'
}

export const api = {
  posts: {
    list: (cursor?: string) =>
      fetch(`/api/posts${cursor ? `?cursor=${cursor}` : ''}`).then((r) => r.json()),
    create: (data: CreatePostData) =>
      fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    like: (id: string) =>
      fetch(`/api/posts/${id}/like`, { method: 'POST' }).then((r) => r.json()),
    likers: (id: string) => fetch(`/api/posts/${id}/likes`).then((r) => r.json()),
    delete: (id: string) =>
      fetch(`/api/posts/${id}`, { method: 'DELETE' }).then((r) => r.json()),
  },
  comments: {
    create: (data: { postId: string; content: string }) =>
      fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    like: (id: string) =>
      fetch(`/api/comments/${id}/like`, { method: 'POST' }).then((r) => r.json()),
    likers: (id: string) => fetch(`/api/comments/${id}/likes`).then((r) => r.json()),
    delete: (id: string) =>
      fetch(`/api/comments/${id}`, { method: 'DELETE' }).then((r) => r.json()),
  },
  replies: {
    create: (data: { commentId: string; content: string }) =>
      fetch('/api/replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    like: (id: string) =>
      fetch(`/api/replies/${id}/like`, { method: 'POST' }).then((r) => r.json()),
    likers: (id: string) => fetch(`/api/replies/${id}/likes`).then((r) => r.json()),
    delete: (id: string) =>
      fetch(`/api/replies/${id}`, { method: 'DELETE' }).then((r) => r.json()),
  },
}
