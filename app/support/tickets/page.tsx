'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle,
  X,
  Eye,
  Reply,
  Paperclip,
  User,
  Calendar,
  Tag,
  ArrowRight,
  ChevronDown,
  Loader2,
  Send,
  Star,
  Shield,
  Zap,
  Package
} from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const TICKET_CATEGORIES = [
  { id: 'payment', name: 'Payment Issue', icon: Shield, color: 'from-blue-500 to-indigo-500' },
  { id: 'order', name: 'Order Problem', icon: Package, color: 'from-purple-500 to-pink-500' },
  { id: 'session', name: 'Session Issue', icon: Calendar, color: 'from-emerald-500 to-teal-500' },
  { id: 'account', name: 'Account Problem', icon: User, color: 'from-amber-500 to-orange-500' },
  { id: 'technical', name: 'Technical Bug', icon: AlertTriangle, color: 'from-red-500 to-rose-500' },
  { id: 'refund', name: 'Refund Request', icon: Shield, color: 'from-gray-500 to-slate-500' },
  { id: 'safety', name: 'Safety Concern', icon: Shield, color: 'from-red-600 to-pink-600' },
  { id: 'other', name: 'Other', icon: MessageSquare, color: 'from-gray-500 to-slate-500' }
]

const TICKET_STATUS = {
  open: { label: 'Open', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', icon: AlertCircle },
  in_progress: { label: 'In Progress', color: 'text-brand-400 bg-brand-500/10 border-brand-500/20', icon: Loader2 },
  awaiting_response: { label: 'Awaiting Response', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: Clock },
  resolved: { label: 'Resolved', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle },
  closed: { label: 'Closed', color: 'text-white/40 bg-white/5 border-white/10', icon: X }
}

const PRIORITY_LEVELS = {
  low: { label: 'Low', color: 'text-white/40' },
  medium: { label: 'Medium', color: 'text-yellow-400' },
  high: { label: 'High', color: 'text-orange-400' },
  urgent: { label: 'Urgent', color: 'text-red-400' }
}

const MOCK_TICKETS = [
  {
    id: 'TKT-001023',
    subject: 'Payment not reflecting in wallet',
    category: 'payment',
    description: 'I made a payment of ₹500 for order SG-2024-001 but it\'s not showing in my wallet balance. Transaction ID: TXN123456789',
    priority: 'high',
    status: 'in_progress',
    created: '2024-01-15T10:30:00Z',
    lastUpdate: '2024-01-15T14:20:00Z',
    assignedTo: 'Support Agent Sarah',
    orderId: 'SG-2024-001',
    attachments: ['payment_screenshot.png'],
    replies: [
      {
        id: 1,
        from: 'user',
        message: 'I made a payment of ₹500 for order SG-2024-001 but it\'s not showing in my wallet balance. Transaction ID: TXN123456789',
        timestamp: '2024-01-15T10:30:00Z',
        attachments: ['payment_screenshot.png']
      },
      {
        id: 2,
        from: 'support',
        message: 'Thank you for contacting us. I can see your payment in our system. It appears to be processing and should reflect in your wallet within 2-4 hours. I\'m escalating this to our payments team for immediate resolution.',
        timestamp: '2024-01-15T11:45:00Z',
        agentName: 'Support Agent Sarah'
      },
      {
        id: 3,
        from: 'support',
        message: 'Update: Your payment has been successfully processed and added to your wallet. The issue has been resolved. Please check your balance and let us know if you need any further assistance.',
        timestamp: '2024-01-15T14:20:00Z',
        agentName: 'Support Agent Sarah'
      }
    ]
  },
  {
    id: 'TKT-000987',
    subject: 'Tutor missed scheduled session',
    category: 'session',
    description: 'My scheduled tutoring session with John Doe at 3 PM today was missed. The tutor didn\'t join the call.',
    priority: 'medium',
    status: 'resolved',
    created: '2024-01-13T09:00:00Z',
    lastUpdate: '2024-01-13T16:30:00Z',
    assignedTo: 'Support Agent Mike',
    orderId: 'SESSION-2024-045',
    attachments: [],
    replies: [
      {
        id: 1,
        from: 'user',
        message: 'My scheduled tutoring session with John Doe at 3 PM today was missed. The tutor didn\'t join the call.',
        timestamp: '2024-01-13T09:00:00Z',
        attachments: []
      },
      {
        id: 2,
        from: 'support',
        message: 'I apologize for the inconvenience. I\'ve contacted the tutor and they had a technical issue. We\'ve already processed a full refund to your wallet and scheduled a complimentary session for tomorrow at the same time.',
        timestamp: '2024-01-13T10:15:00Z',
        agentName: 'Support Agent Mike'
      }
    ]
  },
  {
    id: 'TKT-000998',
    subject: 'App crashing on mobile',
    category: 'technical',
    description: 'The StudyGig app keeps crashing when I try to open the dashboard on my iPhone 12. This started happening after the latest update.',
    priority: 'medium',
    status: 'awaiting_response',
    created: '2024-01-14T15:45:00Z',
    lastUpdate: '2024-01-14T18:20:00Z',
    assignedTo: 'Support Agent Alex',
    orderId: null,
    attachments: ['crash_log.txt'],
    replies: [
      {
        id: 1,
        from: 'user',
        message: 'The StudyGig app keeps crashing when I try to open the dashboard on my iPhone 12. This started happening after the latest update.',
        timestamp: '2024-01-14T15:45:00Z',
        attachments: ['crash_log.txt']
      },
      {
        id: 2,
        from: 'support',
        message: 'I understand the frustration. Our team is aware of this issue affecting some iOS users and is working on a fix. Can you please try clearing your app cache and let me know if that helps temporarily?',
        timestamp: '2024-01-14T18:20:00Z',
        agentName: 'Support Agent Alex'
      }
    ]
  }
]

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState(MOCK_TICKETS)
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)
  const [showNewTicketModal, setShowNewTicketModal] = useState(false)

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = !searchQuery || 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || ticket.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus
    const matchesPriority = selectedPriority === 'all' || ticket.priority === selectedPriority
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority
  })

  const handleReply = async (ticketId: string) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply message')
      return
    }

    setIsSubmittingReply(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const newReply = {
      id: Date.now(),
      from: 'user',
      message: replyText,
      timestamp: new Date().toISOString(),
      attachments: []
    }

    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, replies: [...ticket.replies, newReply], lastUpdate: new Date().toISOString() }
        : ticket
    ))
    
    setReplyText('')
    setIsSubmittingReply(false)
    toast.success('Reply sent successfully')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return 'Today ' + date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      return 'Yesterday ' + date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-IN', { weekday: 'short' }) + ' ' + date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Support Tickets</h1>
          <p className="text-white/40">Track and manage your support requests</p>
        </div>
        
        <button
          onClick={() => setShowNewTicketModal(true)}
          className="btn-primary gap-2"
        >
          <Plus className="w-4 h-4" />
          New Ticket
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets by subject, ID, or description..."
            className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-brand-500/40 transition-all"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {((selectedCategory !== 'all' || selectedStatus !== 'all' || selectedPriority !== 'all') || searchQuery) && (
              <span className="w-2 h-2 bg-brand-400 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-white/[0.02] rounded-xl border border-white/[0.08]"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-white/60 mb-2 block">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm"
                >
                  <option value="all">All Categories</option>
                  {TICKET_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-white/60 mb-2 block">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm"
                >
                  <option value="all">All Statuses</option>
                  {Object.entries(TICKET_STATUS).map(([key, value]) => (
                    <option key={key} value={key}>{value.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-white/60 mb-2 block">Priority</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm"
                >
                  <option value="all">All Priorities</option>
                  {Object.entries(PRIORITY_LEVELS).map(([key, value]) => (
                    <option key={key} value={key}>{value.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSelectedStatus('all')
                  setSelectedPriority('all')
                  setSearchQuery('')
                }}
                className="btn-secondary text-sm"
              >
                Clear All Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="font-semibold text-white mb-2">No tickets found</h3>
            <p className="text-white/40 mb-6">
              {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedPriority !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'You haven\'t created any support tickets yet'
              }
            </p>
            <button
              onClick={() => setShowNewTicketModal(true)}
              className="btn-primary"
            >
              Create Your First Ticket
            </button>
          </div>
        ) : (
          filteredTickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'card overflow-hidden cursor-pointer transition-all',
                selectedTicket === ticket.id && 'ring-2 ring-brand-500/20'
              )}
              onClick={() => setSelectedTicket(selectedTicket === ticket.id ? null : ticket.id)}
            >
              <div className="p-5">
                {/* Ticket Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-white/30 font-mono">{ticket.id}</span>
                      <span className={cn('badge text-xs border', TICKET_STATUS[ticket.status as keyof typeof TICKET_STATUS].color)}>
                        {TICKET_STATUS[ticket.status as keyof typeof TICKET_STATUS].label}
                      </span>
                      <span className={cn('text-xs font-medium', PRIORITY_LEVELS[ticket.priority as keyof typeof PRIORITY_LEVELS].color)}>
                        {PRIORITY_LEVELS[ticket.priority as keyof typeof PRIORITY_LEVELS].label}
                      </span>
                      {ticket.attachments.length > 0 && (
                        <span className="flex items-center gap-1 text-xs text-white/40">
                          <Paperclip className="w-3 h-3" />
                          {ticket.attachments.length}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-white mb-2">{ticket.subject}</h3>
                    <p className="text-white/60 text-sm line-clamp-2">{ticket.description}</p>
                  </div>
                  
                  <ChevronDown className={cn(
                    'w-4 h-4 text-white/40 transition-transform flex-shrink-0 ml-4',
                    selectedTicket === ticket.id && 'rotate-180'
                  )} />
                </div>

                {/* Ticket Meta */}
                <div className="flex items-center justify-between text-xs text-white/30">
                  <div className="flex items-center gap-4">
                    <span>{TICKET_CATEGORIES.find(cat => cat.id === ticket.category)?.name}</span>
                    {ticket.orderId && <span>Order: {ticket.orderId}</span>}
                  </div>
                  <div className="flex items-center gap-4">
                    <span>Created {formatDate(ticket.created)}</span>
                    {ticket.lastUpdate !== ticket.created && (
                      <span>Updated {formatDate(ticket.lastUpdate)}</span>
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {selectedTicket === ticket.id && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/[0.06] pt-4 mt-4">
                        {/* Assigned Agent */}
                        {ticket.assignedTo && (
                          <div className="flex items-center gap-2 mb-4 p-3 bg-white/[0.02] rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center">
                              <User className="w-4 h-4 text-brand-400" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">{ticket.assignedTo}</div>
                              <div className="text-xs text-white/40">Assigned Agent</div>
                            </div>
                          </div>
                        )}

                        {/* Replies */}
                        <div className="space-y-4 mb-4">
                          {ticket.replies.map((reply, replyIndex) => (
                            <div key={reply.id} className={cn(
                              'flex gap-3',
                              reply.from === 'user' ? 'justify-end' : 'justify-start'
                            )}>
                              <div className={cn(
                                'max-w-[80%] p-3 rounded-xl',
                                reply.from === 'user' 
                                  ? 'bg-brand-500 text-white' 
                                  : 'bg-white/[0.06] text-white/80'
                              )}>
                                {reply.from === 'support' && reply.agentName && (
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                      <User className="w-3 h-3 text-emerald-400" />
                                    </div>
                                    <span className="text-xs font-medium text-emerald-400">{reply.agentName}</span>
                                  </div>
                                )}
                                
                                <p className="text-sm leading-relaxed">{reply.message}</p>
                                
                                {reply.attachments && reply.attachments.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {reply.attachments.map((attachment, idx) => (
                                      <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-white/[0.1] rounded text-xs">
                                        <Paperclip className="w-3 h-3" />
                                        {attachment}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                
                                <div className="text-xs text-white/40 mt-2">
                                  {formatDate(reply.timestamp)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Reply Form */}
                        {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Type your reply..."
                              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/30"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleReply(ticket.id)
                              }}
                              disabled={isSubmittingReply || !replyText.trim()}
                              className="btn-primary px-4 py-2"
                            >
                              {isSubmittingReply ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Send className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* New Ticket Modal */}
      <AnimatePresence>
        {showNewTicketModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewTicketModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-white">Create New Ticket</h2>
                <button
                  onClick={() => setShowNewTicketModal(false)}
                  className="btn-icon p-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center mb-6">
                <p className="text-white/40">
                  Select the category that best describes your issue
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {TICKET_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    className="p-4 rounded-xl border border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.04] transition-all text-center group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="font-medium text-white text-sm">{category.name}</div>
                  </button>
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/help-center"
                  className="btn-secondary"
                >
                  Browse Help Center First
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
