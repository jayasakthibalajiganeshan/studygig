'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Bookmark, Share2, Plus, Image, X, Send, Loader2, TrendingUp, Users, Hash } from 'lucide-react'
import { MOCK_POSTS, MOCK_USER } from '@/lib/mock-data'
import { timeAgo, cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Post } from '@/types'

const POST_TYPES = [
  { value: 'update', icon: '💬', label: 'Update' },
  { value: 'achievement', icon: '🏆', label: 'Achievement' },
  { value: 'doubt', icon: '❓', label: 'Doubt' },
  { value: 'project', icon: '🚀', label: 'Project' },
  { value: 'resource', icon: '📚', label: 'Resource' },
]

const TRENDING_TAGS = ['#MachineLearning', '#Thermodynamics', '#ReactJS', '#Calculus', '#UPSC', '#JEE2025', '#DSA', '#Chemistry']

function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(post.liked || false)
  const [saved, setSaved] = useState(post.saved || false)
  const [likes, setLikes] = useState(post.likes_count)
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')

  const handleLike = () => {
    setLiked(!liked)
    setLikes(l => liked ? l - 1 : l + 1)
  }

  const typeConfig: Record<string, { color: string; bg: string }> = {
    achievement: { color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    doubt: { color: 'text-blue-400', bg: 'bg-blue-500/10' },
    project: { color: 'text-brand-400', bg: 'bg-brand-500/10' },
    resource: { color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    update: { color: 'text-white/60', bg: 'bg-white/5' },
  }
  const tc = typeConfig[post.post_type] || typeConfig.update

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <img src={`https://api.dicebear.com/8.x/notionists/svg?seed=${post.user_id}&backgroundColor=b6e3f4`}
          alt="" className="w-10 h-10 rounded-xl bg-brand-500/20 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white text-sm">
              {post.user_id === 'user-1' ? MOCK_USER.full_name : `Student ${post.user_id.slice(-1)}`}
            </span>
            <span className={cn('badge text-xs border-0', tc.bg, tc.color)}>
              {POST_TYPES.find(t => t.value === post.post_type)?.icon} {post.post_type}
            </span>
          </div>
          <div className="text-xs text-white/30">{timeAgo(post.created_at)}</div>
        </div>
      </div>

      {/* Content */}
      <p className="text-white/80 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map(t => (
            <span key={t} className="text-xs text-brand-400 hover:text-brand-300 cursor-pointer transition-colors">#{t}</span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-3 border-t border-white/[0.06]">
        <button onClick={handleLike} className={cn('flex items-center gap-1.5 text-sm transition-all hover:scale-105', liked ? 'text-red-400' : 'text-white/40 hover:text-red-400')}>
          <Heart className={cn('w-4 h-4', liked && 'fill-current')} />
          <span>{likes}</span>
        </button>
        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 text-sm text-white/40 hover:text-blue-400 transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span>{post.comments_count}</span>
        </button>
        <button onClick={() => { setSaved(!saved); toast.success(saved ? 'Removed from saved' : 'Post saved!') }}
          className={cn('flex items-center gap-1.5 text-sm transition-all', saved ? 'text-brand-400' : 'text-white/40 hover:text-brand-400')}>
          <Bookmark className={cn('w-4 h-4', saved && 'fill-current')} />
          <span>{post.saves_count}</span>
        </button>
        <button onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success('Link copied!') }}
          className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors ml-auto">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Comments */}
      <AnimatePresence>
        {showComments && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-white/[0.06] overflow-hidden">
            <div className="flex gap-2">
              <img src={`https://api.dicebear.com/8.x/notionists/svg?seed=user1&backgroundColor=b6e3f4`} alt="" className="w-7 h-7 rounded-lg flex-shrink-0" />
              <div className="flex-1 flex gap-2">
                <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Write a comment..." className="input text-sm py-2 flex-1" />
                <button onClick={() => { if (comment.trim()) { toast.success('Comment posted!'); setComment('') } }} className="btn-primary text-xs py-2 px-3">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="mt-3 p-3 bg-white/[0.02] rounded-xl">
              <div className="text-xs text-white/30 text-center">Be the first to comment!</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function SocialPage() {
  const [showCreate, setShowCreate] = useState(false)
  const [postContent, setPostContent] = useState('')
  const [postType, setPostType] = useState('update')
  const [posting, setPosting] = useState(false)

  const handlePost = async () => {
    if (!postContent.trim()) return toast.error('Write something first!')
    setPosting(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Post published! 🎉')
    setShowCreate(false)
    setPostContent('')
    setPosting(false)
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-display text-2xl font-bold text-white">Social Feed</h1>
          </div>

          {/* Create post */}
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <img src={`https://api.dicebear.com/8.x/notionists/svg?seed=${MOCK_USER.id}&backgroundColor=b6e3f4`}
                alt="" className="w-10 h-10 rounded-xl bg-brand-500/20" />
              <button onClick={() => setShowCreate(true)} className="flex-1 text-left px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/30 text-sm hover:bg-white/[0.06] hover:border-white/[0.12] transition-all">
                What's on your mind, {MOCK_USER.full_name.split(' ')[0]}?
              </button>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-white/[0.06]">
              {POST_TYPES.slice(0, 4).map(t => (
                <button key={t.value} onClick={() => { setPostType(t.value); setShowCreate(true) }}
                  className="flex-1 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors text-xs text-white/40 hover:text-white/70">
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Posts */}
          {MOCK_POSTS.map(post => <PostCard key={post.id} post={post} />)}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Your profile snippet */}
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-4">
              <img src={`https://api.dicebear.com/8.x/notionists/svg?seed=${MOCK_USER.id}&backgroundColor=b6e3f4`}
                alt="" className="w-12 h-12 rounded-xl bg-brand-500/20" />
              <div>
                <div className="font-semibold text-white">{MOCK_USER.full_name}</div>
                <div className="text-xs text-white/40">@{MOCK_USER.username}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: 'Posts', value: 24 },
                { label: 'Followers', value: MOCK_USER.followers_count },
                { label: 'Following', value: MOCK_USER.following_count },
              ].map(s => (
                <div key={s.label} className="p-2 rounded-lg bg-white/[0.03]">
                  <div className="font-bold text-white text-sm">{s.value}</div>
                  <div className="text-xs text-white/30">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending tags */}
          <div className="card p-5">
            <h3 className="font-display font-semibold text-white text-sm mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-400" /> Trending Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {TRENDING_TAGS.map(t => (
                <button key={t} className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/50 text-xs hover:border-brand-500/30 hover:text-brand-400 transition-all">
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Suggested students */}
          <div className="card p-5">
            <h3 className="font-display font-semibold text-white text-sm mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" /> People to Follow
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Priya Menon', role: 'Top Writer · IIT Madras', seed: 'priya', verified: true },
                { name: 'Rahul Verma', role: 'Math Tutor · BITS', seed: 'rahul', verified: true },
                { name: 'Ananya K', role: 'Full Stack Dev · NIT', seed: 'ananya', verified: false },
              ].map(u => (
                <div key={u.name} className="flex items-center gap-3">
                  <img src={`https://api.dicebear.com/8.x/notionists/svg?seed=${u.seed}&backgroundColor=b6e3f4`}
                    alt="" className="w-9 h-9 rounded-xl bg-brand-500/20 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-white truncate">{u.name}</span>
                      {u.verified && <span className="text-emerald-400 text-xs">✓</span>}
                    </div>
                    <div className="text-xs text-white/30 truncate">{u.role}</div>
                  </div>
                  <button onClick={() => toast.success(`Following ${u.name}!`)}
                    className="text-xs text-brand-400 border border-brand-500/30 px-3 py-1 rounded-lg hover:bg-brand-500/10 transition-all flex-shrink-0">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create post modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="card p-6 w-full max-w-lg">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-white text-lg">Create Post</h2>
                <button onClick={() => setShowCreate(false)} className="btn-icon p-1.5"><X className="w-4 h-4 text-white/60" /></button>
              </div>

              <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                {POST_TYPES.map(t => (
                  <button key={t.value} onClick={() => setPostType(t.value)}
                    className={cn('px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border',
                      postType === t.value ? 'bg-brand-500/20 border-brand-500/40 text-brand-300' : 'border-white/10 text-white/40')}>
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mb-4">
                <img src={`https://api.dicebear.com/8.x/notionists/svg?seed=${MOCK_USER.id}&backgroundColor=b6e3f4`}
                  alt="" className="w-10 h-10 rounded-xl bg-brand-500/20 flex-shrink-0" />
                <textarea value={postContent} onChange={e => setPostContent(e.target.value)} rows={5}
                  placeholder="Share your thoughts, doubts, achievements..." className="textarea flex-1 text-sm" />
              </div>

              <div className="flex items-center gap-3">
                <button className="btn-ghost text-sm"><Image className="w-4 h-4" /> Add Image</button>
                <button className="btn-ghost text-sm"><Hash className="w-4 h-4" /> Add Tags</button>
                <button onClick={handlePost} disabled={posting || !postContent.trim()} className="btn-primary ml-auto">
                  {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {posting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
