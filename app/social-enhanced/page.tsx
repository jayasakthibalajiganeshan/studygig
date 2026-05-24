'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal, 
  Plus, 
  Send, 
  Image, 
  Video, 
  Users, 
  Calendar, 
  MapPin, 
  Phone, 
  Video as VideoIcon,
  Star, 
  TrendingUp, 
  Eye, 
  Settings, 
  Camera, 
  FileText, 
  Award, 
  ChevronRight,
  ArrowLeft,
  X,
  Filter,
  Search,
  Grid,
  List,
  UserPlus,
  MessageSquare,
  Bell,
  Hash
} from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Post {
  id: string
  author: {
    id: string
    name: string
    username: string
    avatar: string
    verification: boolean
    role: string
  }
  content: string
  image?: string
  video?: string
  timestamp: string
  likes: number
  comments: number
  shares: number
  tags: string[]
  views: number
  isLiked: boolean
  isBookmarked: boolean
}

interface Comment {
  id: string
  author: {
    id: string
    name: string
    username: string
    avatar: string
  }
  content: string
  timestamp: string
  likes: number
  isAuthor: boolean
}

interface UserProfile {
  id: string
  name: string
  username: string
    avatar: string
    bio: string
    role: string
    verification: boolean
    followers: number
    following: number
  posts: number
  achievements: Achievement[]
  skills: string[]
  education: string
  joinedDate: string
  isFollowing: boolean
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  color: string
  dateEarned: string
  category: string
}

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: {
      id: 'user1',
      name: 'Sarah Johnson',
      username: 'sarahj',
      avatar: 'https://api.dicebear.com/8.x/notionists/svg?seed=sarah&backgroundColor=b6e3f4',
      verification: true,
      role: 'Top Writer'
    },
    content: 'Just completed my first handwritten assignment! The quality scoring system really helps identify the best writers for specific subjects. My handwriting quality improved from 7.2 to 8.5 after implementing the new feedback mechanisms.',
    image: 'https://picsum.photos/400/300/writing/assignment.jpg',
    timestamp: '2024-01-15T10:30:00Z',
    likes: 42,
    comments: 8,
    shares: 12,
    tags: ['handwriting', 'writing', 'achievement'],
    views: 156,
    isLiked: true,
    isBookmarked: false
  },
  {
    id: '2',
    author: {
      id: 'user2',
      name: 'Mike Chen',
      username: 'mikec',
      avatar: 'https://api.dicebear.com/8.x/notionists/svg?seed=mike&backgroundColor=8b5cf6',
      verification: true,
      role: 'AI Specialist'
    },
    content: 'New AI-powered study assistant feature is live! Students can now get instant help with homework problems, study scheduling, and exam preparation. The response time has improved by 87%.',
    video: 'https://picsum.photos/400/300/tech/ai-assistant.mp4',
    timestamp: '2024-01-15T09:15:00Z',
    likes: 28,
    comments: 15,
    shares: 8,
    tags: ['ai', 'technology', 'innovation'],
    views: 89,
    isLiked: false,
    isBookmarked: true
  },
  {
    id: '3',
    author: {
      id: 'user3',
      name: 'Alex Kumar',
      username: 'alexk',
      avatar: 'https://api.dicebear.com/8.x/notionists/svg?seed=alex&backgroundColor=34d399',
      verification: false,
      role: 'Study Companion'
    },
    content: 'Looking for study partners for the upcoming semester! Interested in computer science and mathematics. Anyone else preparing for similar subjects?',
    timestamp: '2024-01-14T16:45:00Z',
    likes: 15,
    comments: 6,
    shares: 3,
    tags: ['study', 'companion', 'collaboration'],
    views: 67,
    isLiked: false,
    isBookmarked: false
  }
]

const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    author: {
      id: 'user4',
      name: 'Emily Davis',
      username: 'emilyd',
      avatar: 'https://api.dicebear.com/8.x/notionists/svg?seed=emily&backgroundColor=e91e63',
    },
    content: 'This is exactly what I needed! The quality metrics are so helpful for tracking improvement over time.',
    timestamp: '2024-01-15T11:00:00Z',
    likes: 2,
    isAuthor: false
  },
  {
    id: '2',
    author: {
      id: 'user5',
      name: 'David Wilson',
      username: 'davidw',
      avatar: 'https://api.dicebear.com/8.x/notionists/svg?seed=david&backgroundColor=06b6d4',
    },
    content: 'Great work on the handwriting analysis! The visual quality scoring really makes a difference in writer selection.',
    timestamp: '2024-01-15T11:30:00Z',
    likes: 3,
    isAuthor: false
  }
]

const MOCK_USER_PROFILE: UserProfile = {
  id: 'current-user',
  name: 'John Doe',
  username: 'johndoe',
  avatar: 'https://api.dicebear.com/8.x/notionists/svg?seed=john&backgroundColor=6366f1',
  bio: 'Computer Science student | AI enthusiast | Study companion',
  role: 'Student',
  verification: true,
  followers: 342,
  following: 128,
  posts: 47,
  achievements: [
    { id: '1', title: 'Top Writer', description: 'Achieved 8.5+ handwriting quality', icon: '🏆', color: '#10b981', dateEarned: '2024-01-10', category: 'writing' },
    { id: '2', title: 'AI Expert', description: 'Completed 50+ AI projects', icon: '🤖', color: '#3b82f6', dateEarned: '2024-01-08', category: 'technology' },
    { id: '3', title: 'Social Butterfly', description: 'Connected with 100+ students', icon: '🦋', color: '#ec4899', dateEarned: '2024-01-05', category: 'social' }
  ],
  skills: ['Python', 'JavaScript', 'React', 'Machine Learning', 'Computer Science'],
  education: 'B.Tech Computer Science',
  joinedDate: '2023-09-15',
  isFollowing: false
}

const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: 'Top Writer', description: 'Achieved 8.5+ handwriting quality', icon: '🏆', color: '#10b981', dateEarned: '2024-01-10', category: 'writing' },
  { id: '2', title: 'AI Expert', description: 'Completed 50+ AI projects', icon: '🤖', color: '#3b82f6', dateEarned: '2024-01-08', category: 'technology' },
  { id: '3', title: 'Social Butterfly', description: 'Connected with 100+ students', icon: '🦋', color: '#ec4899', dateEarned: '2024-01-05', category: 'social' }
]

export default function SocialEnhancedPage() {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [showNewPostModal, setShowNewPostModal] = useState(false)
  const [newPost, setNewPost] = useState({
    content: '',
    image: null,
    video: null,
    tags: []
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchQuery || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesFilter = selectedFilter === 'all' || post.tags.includes(selectedFilter)
    
    return matchesSearch && matchesFilter
  })

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1, isLiked: true }
        : { ...post, likes: post.likes - 1, isLiked: false }
    ))
    
    toast.success(post.isLiked ? 'Post liked!' : 'Post unliked!')
  }

  const handleCommentPost = (postId: string, content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: MOCK_USER_PROFILE,
      content,
      timestamp: new Date().toISOString(),
      likes: 0,
      isAuthor: true
    }

    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    ))
    
    setNewPost({ content: '', image: null, video: null, tags: [] })
    toast.success('Comment added!')
  }

  const handleSharePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, shares: post.shares + 1 }
        : post
    ))
    
    toast.success('Post shared!')
  }

  const handleBookmarkPost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: true }
        : post
    ))
    
    toast.success(post.isBookmarked ? 'Post bookmarked!' : 'Post unbookmarked!')
  }

  const handleFollowUser = (userId: string) => {
    toast.success('User followed!')
  }

  const handleCreatePost = () => {
    if (!newPost.content.trim()) {
      toast.error('Please add content to your post')
      return
    }

    setIsUploading(true)
    
    // Simulate post creation
    setTimeout(() => {
      const createdPost: Post = {
        id: Date.now().toString(),
        author: MOCK_USER_PROFILE,
        content: newPost.content,
        image: newPost.image,
        video: newPost.video,
        tags: newPost.tags,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0,
        isLiked: false,
        isBookmarked: false
      }

      setPosts(prev => [createdPost, ...prev])
      setNewPost({ content: '', image: null, video: null, tags: [] })
      setIsUploading(false)
      setShowNewPostModal(false)
      
      toast.success('Post created successfully!')
    }, 2000)
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours < 1) {
      return 'Just now'
    } else if (hours < 24) {
      return `${hours}h ago`
    } else if (hours < 48) {
      return `${Math.floor(hours / 24)}d ago`
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    } else {
      return num.toString()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">StudyGig Social</h1>
              <p className="text-gray-600">Connect • Collaborate • Succeed</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNewPostModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Create Post</span>
              </button>
              
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Video className="w-5 h-5" />
                <span className="font-medium">Go Live</span>
              </button>
              
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Users className="w-5 h-5" />
                <span className="font-medium">Find People</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts, people, tags..."
                  className="pl-10 pr-4 py-2 w-64 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <Grid className="w-4 h-4" />
                  <span className="font-medium">{viewMode === 'grid' ? 'List View' : 'Grid View'}</span>
                </button>
                
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={cn(
                    'px-3 py-2 rounded-lg transition-colors',
                    selectedFilter === 'all' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <Filter className="w-4 h-4" />
                  <span className="font-medium">All</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - User Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-8">
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="text-center">
                  <img
                    src={MOCK_USER_PROFILE.avatar}
                    alt={MOCK_USER_PROFILE.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-gray-300"
                  />
                  <h2 className="text-xl font-bold text-gray-900">{MOCK_USER_PROFILE.name}</h2>
                  <p className="text-gray-600">@{MOCK_USER_PROFILE.username}</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium',
                      MOCK_USER_PROFILE.verification ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    )}>
                      {MOCK_USER_PROFILE.verification ? '✓ Verified' : 'Unverified'}
                    </span>
                    <span className="text-gray-500 text-sm">Level {MOCK_USER_PROFILE.posts + 47}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="flex-1 items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{formatNumber(MOCK_USER_PROFILE.followers)}</span>
                      <span className="text-gray-600 text-sm">Followers</span>
                    </button>
                    
                    <button className="flex-1 items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <UserPlus className="w-4 h-4" />
                      <span className="text-sm">{formatNumber(MOCK_USER_PROFILE.following)}</span>
                      <span className="text-gray-600 text-sm">Following</span>
                    </button>
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-700 leading-relaxed">{MOCK_USER_PROFILE.bio}</p>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_USER_PROFILE.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Education</h3>
                  <p className="text-gray-700">{MOCK_USER_PROFILE.education}</p>
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
                  <div className="space-y-3">
                    {MOCK_USER_PROFILE.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div
                          className="w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-white"
                          style={{ backgroundColor: achievement.color }}
                        >
                          <span className="text-2xl">{achievement.icon}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                          <p className="text-sm text-gray-600 mb-1">{achievement.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Earned {achievement.dateEarned}</span>
                            <span className="text-xs text-gray-500">{achievement.category}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-medium">Message</span>
                  </button>
                  
                  <button
                    onClick={() => handleFollowUser(MOCK_USER_PROFILE.id)}
                    className="flex-1 items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="font-medium">Follow</span>
                  </button>
                  
                  <button className="flex-1 items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                    <span className="font-medium">Edit Profile</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2">
            {/* Create Post */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Share Your Update</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">What's on your mind?</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Share your thoughts, achievements, or ask questions..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add image (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setNewPost(prev => ({ ...prev, image: URL.createObjectURL(reader.result) }))
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {newPost.image && (
                    <div className="mt-2">
                      <img
                        src={newPost.image}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add video (optional)</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setNewPost(prev => ({ ...prev, video: URL.createObjectURL(reader.result) }))
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {newPost.video && (
                    <div className="mt-2">
                      <video
                        src={newPost.video}
                        controls
                        className="w-full h-48 rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    value={newPost.tags.join(', ')}
                    onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) }))}
                    placeholder="writing, ai, study, companion, achievement..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCreatePost}
                    disabled={isUploading || !newPost.content.trim()}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-transparent rounded-full animate-spin" />
                        <span>Posting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Post</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setShowNewPostModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Posts Feed */}
            <div className={cn(
              'space-y-6',
              viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'
            )}>
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={cn(
                    'bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300',
                    'cursor-pointer'
                  )}
                >
                  {/* Post Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-12 h-12 rounded-full border-2 border-gray-300"
                        />
                        <div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                            <div className="flex items-center gap-1">
                              <span className={cn(
                                'text-sm text-gray-600',
                                post.author.verification && 'text-green-600'
                              )}>
                                {post.author.username}
                              </span>
                              {post.author.verification && (
                                <span className="ml-1 text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded-full">✓</span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              {post.author.role}
                            </span>
                          </div>
                        </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{formatTimestamp(post.timestamp)}</span>
                        
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleLikePost(post.id)}
                            className={cn(
                              'flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors',
                              post.isLiked && 'text-red-600'
                            )}
                          >
                            <Heart className={cn('w-4 h-4', post.isLiked && 'fill-current')} />
                            <span className="text-sm">{formatNumber(post.likes)}</span>
                          </button>
                          
                          <button
                            onClick={() => handleCommentPost(post.id, '')}
                            className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm">{formatNumber(post.comments)}</span>
                          </button>
                          
                          <button
                            onClick={() => handleSharePost(post.id)}
                            className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                            <span className="text-sm">{formatNumber(post.shares)}</span>
                          </button>
                          
                          <button
                            onClick={() => handleBookmarkPost(post.id)}
                            className="flex items-center gap-1 text-gray-600 hover:text-yellow-600 transition-colors"
                          >
                            <Bookmark className={cn('w-4 h-4', post.isBookmarked && 'fill-current')} />
                            <span className="text-sm">{post.isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <p className="text-gray-800 leading-relaxed">{post.content}</p>
                    
                    {post.image && (
                      <div className="mt-4">
                        <img
                          src={post.image}
                          alt="Post image"
                          className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-all duration-300"
                          onClick={() => window.open(post.image, '_blank')}
                        />
                      </div>
                    )}
                    
                    {post.video && (
                      <div className="mt-4">
                        <video
                          src={post.video}
                          controls
                          className="w-full h-64 rounded-lg cursor-pointer"
                        />
                      </div>
                    )}
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Engagement Bar */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <Eye className="w-4 h-4" />
                        <span>{formatNumber(post.views)} views</span>
                        <span className="mx-2">•</span>
                        <Heart className="w-4 h-4" />
                        <span>{formatNumber(post.likes)}</span>
                        <span className="mx-2">•</span>
                        <MessageCircle className="w-4 h-4" />
                        <span>{formatNumber(post.comments)}</span>
                        <span className="mx-2">•</span>
                        <Share2 className="w-4 h-4" />
                        <span>{formatNumber(post.shares)}</span>
                      </div>
                      
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* No Posts */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl text-gray-400 mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
                <button
                  onClick={() => setShowNewPostModal(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create First Post
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      <AnimatePresence>
        {showNewPostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowNewPostModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Create New Post</h2>
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">What's on your mind?</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Share your thoughts, achievements, or ask questions..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={4}
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add image (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setNewPost(prev => ({ ...prev, image: URL.createObjectURL(reader.result) }))
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {newPost.image && (
                    <div className="mt-2">
                      <img
                        src={newPost.image}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add video (optional)</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setNewPost(prev => ({ ...prev, video: URL.createObjectURL(reader.result) }))
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {newPost.video && (
                    <div className="mt-2">
                      <video
                        src={newPost.video}
                        controls
                        className="w-full h-48 rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    value={newPost.tags.join(', ')}
                    onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) }))}
                    placeholder="writing, ai, study, companion, achievement..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCreatePost}
                    disabled={isUploading || !newPost.content.trim()}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-transparent rounded-full animate-spin" />
                        <span>Posting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Post</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setShowNewPostModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
