"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Plus,
  Search,
} from "lucide-react";

interface Post {
  id: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
}

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    author: "Sarah Johnson",
    content: "Just completed my first handwritten assignment successfully!",
    likes: 42,
    comments: 8,
    shares: 4,
  },
  {
    id: "2",
    author: "Mike Chen",
    content: "AI-powered study assistant feature is coming soon 🚀",
    likes: 30,
    comments: 12,
    shares: 6,
  },
];

export default function SocialEnhancedPage() {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [newPost, setNewPost] = useState("");
  const [search, setSearch] = useState("");

  const filteredPosts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(search.toLowerCase()) ||
      post.author.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreatePost = () => {
    if (!newPost.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      author: "You",
      content: newPost,
      likes: 0,
      comments: 0,
      shares: 0,
    };

    setPosts([post, ...posts]);
    setNewPost("");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h1 className="text-3xl font-bold mb-4">StudyGig Social</h1>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-xl"
            />
          </div>

          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full border rounded-xl p-4 mb-4"
            rows={4}
          />

          <button
            onClick={handleCreatePost}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Create Post
          </button>
        </div>

        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h2 className="font-bold text-lg mb-2">{post.author}</h2>

              <p className="text-gray-700 mb-4">{post.content}</p>

              <div className="flex items-center gap-6 text-gray-500">
                <button className="flex items-center gap-2 hover:text-red-500">
                  <Heart className="w-5 h-5" />
                  {post.likes}
                </button>

                <button className="flex items-center gap-2 hover:text-blue-500">
                  <MessageCircle className="w-5 h-5" />
                  {post.comments}
                </button>

                <button className="flex items-center gap-2 hover:text-green-500">
                  <Share2 className="w-5 h-5" />
                  {post.shares}
                </button>

                <button className="flex items-center gap-2 hover:text-yellow-500">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
