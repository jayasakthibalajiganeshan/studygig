'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Paperclip, 
  Phone, 
  Video, 
  Smile, 
  Mic, 
  MoreVertical,
  X,
  User,
  Bot,
  CheckCircle2,
  Clock,
  Shield,
  Star,
  Zap,
  MessageCircle,
  Users,
  Headphones,
  ArrowLeft,
  Minimize2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const CHAT_THEMES = {
  general: { name: 'General Support', icon: MessageCircle, color: 'from-blue-500 to-indigo-500' },
  technical: { name: 'Technical Support', icon: Shield, color: 'from-emerald-500 to-teal-500' },
  billing: { name: 'Billing Support', icon: Star, color: 'from-purple-500 to-pink-500' },
  urgent: { name: 'Urgent Support', icon: Zap, color: 'from-red-500 to-rose-500' }
}

const SUPPORT_AGENTS = [
  {
    id: 'sarah',
    name: 'Sarah Johnson',
    role: 'Senior Support Agent',
    avatar: 'sarah',
    status: 'online',
    expertise: ['Payments', 'Orders', 'Account Issues'],
    rating: 4.9,
    responseTime: '2 min',
    languages: ['English', 'Hindi'],
    satisfaction: 98
  },
  {
    id: 'mike',
    name: 'Mike Chen',
    role: 'Technical Support',
    avatar: 'mike',
    status: 'online',
    expertise: ['App Issues', 'Bug Reports', 'Technical Problems'],
    rating: 4.8,
    responseTime: '1 min',
    languages: ['English', 'Mandarin'],
    satisfaction: 96
  },
  {
    id: 'alex',
    name: 'Alex Kumar',
    role: 'Support Agent',
    avatar: 'alex',
    status: 'away',
    expertise: ['General Inquiries', 'Navigation', 'Features'],
    rating: 4.7,
    responseTime: '3 min',
    languages: ['English', 'Hindi'],
    satisfaction: 94
  }
]

const QUICK_RESPONSES = [
  'How can I help you today?',
  'I understand your concern. Let me look into that for you.',
  'Thank you for your patience. I\'m working on resolving this issue.',
  'Is there anything else I can help you with?',
  'I\'m escalating this to our senior team for immediate attention.',
  'Your satisfaction is our priority. Let me find the best solution for you.'
]

const TYPING_INDICATORS = [
  'Agent is typing...',
  'Support agent is responding...',
  'Finding solution for you...'
]

export default function ChatSupportPage() {
  const [selectedTheme, setSelectedTheme] = useState('general')
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'bot',
      message: 'Welcome to StudyGig Support! 🎉',
      timestamp: new Date().toISOString(),
      agentName: 'Support Bot'
    },
    {
      id: 2,
      from: 'bot',
      message: 'I\'m here to help you with any questions or issues. You can ask me about orders, payments, sessions, or technical problems.',
      timestamp: new Date(Date.now() + 1000).toISOString(),
      agentName: 'Support Bot'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [showAgents, setShowAgents] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Simulate connection
    const timer = setTimeout(() => {
      setIsConnected(true)
      toast.success('Connected to support chat')
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Auto scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      from: 'user',
      message: inputMessage.trim(),
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate agent response
    setTimeout(() => {
      const agentResponse = {
        id: Date.now() + 1,
        from: selectedAgent ? 'agent' : 'bot',
        message: selectedAgent 
          ? QUICK_RESPONSES[Math.floor(Math.random() * QUICK_RESPONSES.length)]
          : 'Let me connect you with a human agent for better assistance.',
        timestamp: new Date().toISOString(),
        agentName: selectedAgent 
          ? SUPPORT_AGENTS.find(a => a.id === selectedAgent)?.name
          : 'Support Bot'
      }

      setMessages(prev => [...prev, agentResponse])
      setIsTyping(false)
    }, 2000)
  }

  const connectToAgent = (agentId: string) => {
    setSelectedAgent(agentId)
    const agent = SUPPORT_AGENTS.find(a => a.id === agentId)
    
    const systemMessage = {
      id: Date.now(),
      from: 'system',
      message: `Connecting you to ${agent?.name} (${agent?.role})...`,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, systemMessage])

    setTimeout(() => {
      const agentMessage = {
        id: Date.now() + 1,
        from: 'agent',
        message: `Hello! I'm ${agent?.name}, your ${agent?.role}. How can I assist you today?`,
        timestamp: new Date().toISOString(),
        agentName: agent?.name
      }
      setMessages(prev => [...prev, agentMessage])
    }, 1500)
  }

  const startCall = (type: 'audio' | 'video') => {
    if (!selectedAgent) {
      toast.error('Please connect to an agent first')
      return
    }
    toast.success(`Starting ${type} call with ${SUPPORT_AGENTS.find(a => a.id === selectedAgent)?.name}...`)
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-emerald-500'
      case 'away': return 'bg-amber-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-brand-500 text-white rounded-full p-3 shadow-lg hover:bg-brand-600 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="h-screen bg-[#0a0a18] flex">
      {/* Sidebar */}
      <div className="w-80 bg-[#0f0f1e] border-r border-white/[0.08] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.08]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-white">Live Support</h2>
            <button
              onClick={() => setIsMinimized(true)}
              className="btn-icon p-1.5"
            >
              <Minimize2 className="w-4 h-4 text-white/60" />
            </button>
          </div>

          {/* Theme Selection */}
          <div className="space-y-2">
            <div className="text-xs text-white/40 uppercase tracking-wider">Select Department</div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(CHAT_THEMES).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTheme(key)}
                  className={cn(
                    'p-3 rounded-xl border text-left transition-all',
                    selectedTheme === key
                      ? 'border-brand-500/40 bg-brand-500/10'
                      : 'border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.04]'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${theme.color} flex items-center justify-center`}>
                      <theme.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">{theme.name}</div>
                      <div className="text-white/40 text-xs">
                        {SUPPORT_AGENTS.filter(a => a.expertise.some(exp => theme.name.toLowerCase().includes(exp.toLowerCase()))).length} agents
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="p-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 mb-3">
            <div className={cn(
              'w-2 h-2 rounded-full',
              isConnected ? 'bg-emerald-500' : 'bg-amber-500'
            )} />
            <span className="text-sm text-white">
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>

          <button
            onClick={() => setShowAgents(!showAgents)}
            className="w-full btn-secondary text-sm"
          >
            {showAgents ? 'Hide' : 'Show'} Available Agents ({SUPPORT_AGENTS.filter(a => a.status === 'online').length})
          </button>
        </div>

        {/* Agents List */}
        <AnimatePresence>
          {showAgents && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex-1 overflow-y-auto p-4 space-y-3"
            >
              {SUPPORT_AGENTS.map((agent, index) => (
                <motion.button
                  key={agent.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => connectToAgent(agent.id)}
                  className={cn(
                    'w-full p-3 rounded-xl border text-left transition-all',
                    selectedAgent === agent.id
                      ? 'border-brand-500/40 bg-brand-500/10'
                      : 'border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.04]'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={`https://api.dicebear.com/8.x/notionists/svg?seed=${agent.avatar}&backgroundColor=b6e3f4`}
                        alt={agent.name}
                        className="w-10 h-10 rounded-lg"
                      />
                      <div className={cn(
                        'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0f0f1e]',
                        getStatusColor(agent.status)
                      )} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white text-sm">{agent.name}</div>
                      <div className="text-white/40 text-xs">{agent.role}</div>
                      <div className="flex items-center gap-3 text-xs text-white/30 mt-1">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-current" />
                          {agent.rating}
                        </span>
                        <span>{agent.responseTime}</span>
                        <span>{agent.satisfaction}%</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 bg-[#0f0f1e] border-b border-white/[0.08]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedAgent ? (
                <>
                  <img
                    src={`https://api.dicebear.com/8.x/notionists/svg?seed=${SUPPORT_AGENTS.find(a => a.id === selectedAgent)?.avatar}&backgroundColor=b6e3f4`}
                    alt="Agent"
                    className="w-8 h-8 rounded-lg"
                  />
                  <div>
                    <div className="font-medium text-white text-sm">
                      {SUPPORT_AGENTS.find(a => a.id === selectedAgent)?.name}
                    </div>
                    <div className="text-white/40 text-xs">
                      {SUPPORT_AGENTS.find(a => a.id === selectedAgent)?.role}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Bot className="w-6 h-6 text-brand-400" />
                  <div>
                    <div className="font-medium text-white text-sm">Support Bot</div>
                    <div className="text-white/40 text-xs">AI Assistant</div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => startCall('audio')}
                disabled={!selectedAgent}
                className="btn-icon p-2 disabled:opacity-50"
                title="Audio Call"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => startCall('video')}
                disabled={!selectedAgent}
                className="btn-icon p-2 disabled:opacity-50"
                title="Video Call"
              >
                <Video className="w-4 h-4" />
              </button>
              <button
                className="btn-icon p-2"
                title="More Options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'flex gap-3',
                message.from === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.from !== 'user' && (
                <div className="flex-shrink-0">
                  {message.from === 'bot' ? (
                    <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-brand-400" />
                    </div>
                  ) : (
                    <img
                      src={`https://api.dicebear.com/8.x/notionists/svg?seed=${SUPPORT_AGENTS.find(a => a.name === message.agentName)?.avatar}&backgroundColor=b6e3f4`}
                      alt={message.agentName}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                </div>
              )}

              <div className={cn(
                'max-w-[70%] rounded-2xl p-3',
                message.from === 'user' 
                  ? 'bg-brand-500 text-white' 
                  : message.from === 'system'
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                  : 'bg-white/[0.06] text-white/80 border border-white/[0.08]'
              )}>
                {message.from !== 'user' && message.agentName && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm">
                      {message.agentName}
                    </span>
                    {message.from === 'agent' && (
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span className="text-xs text-emerald-400">Verified Agent</span>
                      </div>
                    )}
                  </div>
                )}
                
                <p className="text-sm leading-relaxed">{message.message}</p>
                
                <div className="flex items-center justify-between mt-2 text-xs opacity-60">
                  <span>{formatTime(message.timestamp)}</span>
                  {message.from === 'agent' && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400" />
                      <span>Rate this response</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce delay-100" />
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
                <div className="bg-white/[0.06] rounded-2xl px-3 py-2">
                  <span className="text-sm text-white/60">
                    {selectedAgent ? 'Agent is typing...' : 'Support bot is responding...'}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#0f0f1e] border-t border-white/[0.08]">
          <div className="flex items-end gap-2">
            <button className="btn-icon p-2" title="Attach File">
              <Paperclip className="w-4 h-4" />
            </button>
            
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                placeholder="Type your message..."
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 pr-12 text-white placeholder-white/30 focus:outline-none focus:border-brand-500/40 transition-all"
                disabled={!isConnected}
              />
              
              <button className="btn-icon p-2 absolute right-2 top-1/2 -translate-y-1/2" title="Emoji">
                <Smile className="w-4 h-4" />
              </button>
            </div>

            <button className="btn-icon p-2" title="Voice Message">
              <Mic className="w-4 h-4" />
            </button>

            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || !isConnected}
              className="btn-primary p-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
