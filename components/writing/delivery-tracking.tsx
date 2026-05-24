'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Phone, 
  MessageCircle,
  RefreshCw,
  Download,
  Share2,
  Calendar,
  Navigation,
  Home,
  User,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface DeliveryUpdate {
  id: string
  status: string
  location?: string
  description: string
  timestamp: string
  isCompleted: boolean
}

interface DeliveryTrackingProps {
  deliveryId: string
  orderId: string
  trackingId?: string
  courierService?: string
  estimatedDelivery?: string
  senderName: string
  receiverName: string
  currentStatus: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'returned' | 'lost'
  onReportIssue: () => void
  onContactSupport: () => void
}

const STATUS_CONFIG = {
  pending: {
    icon: Package,
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/10',
    borderColor: 'border-gray-500/20',
    label: 'Order Placed',
    description: 'Waiting for courier pickup'
  },
  picked_up: {
    icon: Truck,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    label: 'Picked Up',
    description: 'Package collected from sender'
  },
  in_transit: {
    icon: Package,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    label: 'In Transit',
    description: 'Package is on the way'
  },
  out_for_delivery: {
    icon: Truck,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    label: 'Out for Delivery',
    description: 'Final delivery in progress'
  },
  delivered: {
    icon: CheckCircle,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    label: 'Delivered',
    description: 'Package delivered successfully'
  },
  returned: {
    icon: Package,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    label: 'Returned',
    description: 'Package returned to sender'
  },
  lost: {
    icon: AlertCircle,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    label: 'Lost',
    description: 'Package lost in transit'
  }
}

const MOCK_UPDATES: DeliveryUpdate[] = [
  {
    id: '1',
    status: 'pending',
    description: 'Order placed and pickup scheduled',
    timestamp: '2024-01-15T10:00:00Z',
    isCompleted: true
  },
  {
    id: '2',
    status: 'picked_up',
    location: 'Mumbai, Maharashtra',
    description: 'Package picked up from sender address',
    timestamp: '2024-01-15T14:30:00Z',
    isCompleted: true
  },
  {
    id: '3',
    status: 'in_transit',
    location: 'Pune, Maharashtra',
    description: 'Package in transit - Arrived at sorting facility',
    timestamp: '2024-01-16T08:15:00Z',
    isCompleted: true
  },
  {
    id: '4',
    status: 'in_transit',
    location: 'Bangalore, Karnataka',
    description: 'Package departed from facility',
    timestamp: '2024-01-16T16:45:00Z',
    isCompleted: true
  },
  {
    id: '5',
    status: 'out_for_delivery',
    location: 'Bangalore, Karnataka',
    description: 'Out for delivery - Expected by 6 PM today',
    timestamp: '2024-01-17T09:00:00Z',
    isCompleted: false
  }
]

export default function DeliveryTracking({
  deliveryId,
  orderId,
  trackingId,
  courierService,
  estimatedDelivery,
  senderName,
  receiverName,
  currentStatus,
  onReportIssue,
  onContactSupport
}: DeliveryTrackingProps) {
  const [updates, setUpdates] = useState<DeliveryUpdate[]>(MOCK_UPDATES)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showLiveMap, setShowLiveMap] = useState(false)
  const [selectedUpdate, setSelectedUpdate] = useState<DeliveryUpdate | null>(null)

  const currentConfig = STATUS_CONFIG[currentStatus]
  const CurrentIcon = currentConfig.icon

  const refreshTracking = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Add new update if status changed
    const newUpdate: DeliveryUpdate = {
      id: Date.now().toString(),
      status: currentStatus,
      location: 'Local Facility',
      description: 'Tracking information updated',
      timestamp: new Date().toISOString(),
      isCompleted: false
    }
    
    setUpdates(prev => [...prev, newUpdate])
    setIsRefreshing(false)
    toast.success('Tracking updated successfully')
  }

  const shareTracking = () => {
    const shareUrl = `${window.location.origin}/track/${trackingId}`
    if (navigator.share) {
      navigator.share({
        title: `Track Delivery - Order ${orderId}`,
        text: `Track your package delivery with tracking ID: ${trackingId}`,
        url: shareUrl
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
      toast.success('Tracking link copied to clipboard!')
    }
  }

  const downloadReceipt = () => {
    // Simulate download
    toast.success('Downloading delivery receipt...')
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      relative: getRelativeTime(date)
    }
  }

  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return 'Just now'
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white mb-2">Track Delivery</h1>
          <p className="text-white/40">Order #{orderId}</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={refreshTracking}
            disabled={isRefreshing}
            className="btn-icon p-2"
          >
            <RefreshCw className={cn('w-5 h-5', isRefreshing && 'animate-spin')} />
          </button>
          <button onClick={shareTracking} className="btn-icon p-2">
            <Share2 className="w-5 h-5" />
          </button>
          <button onClick={downloadReceipt} className="btn-icon p-2">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Current Status Card */}
      <div className={cn(
        'card p-6 border-2',
        currentConfig.bgColor,
        currentConfig.borderColor
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            'w-16 h-16 rounded-2xl flex items-center justify-center',
            currentConfig.bgColor
          )}>
            <CurrentIcon className={cn('w-8 h-8', currentConfig.color)} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="font-display text-xl font-bold text-white">
                {currentConfig.label}
              </h2>
              {currentStatus === 'delivered' && (
                <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                  COMPLETED
                </span>
              )}
            </div>
            <p className="text-white/60 mb-3">{currentConfig.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-white/40 block">Tracking ID</span>
                <span className="text-white font-medium">{trackingId || 'N/A'}</span>
              </div>
              <div>
                <span className="text-white/40 block">Courier</span>
                <span className="text-white font-medium">{courierService || 'Standard'}</span>
              </div>
              <div>
                <span className="text-white/40 block">Est. Delivery</span>
                <span className="text-white font-medium">
                  {estimatedDelivery ? new Date(estimatedDelivery).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-white/40 block">Status</span>
                <span className={cn('font-medium', currentConfig.color)}>
                  {currentConfig.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-brand-400" />
            <h3 className="font-semibold text-white">Sender</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="text-white font-medium">{senderName}</div>
            <div className="text-white/60">Mumbai, Maharashtra - 400001</div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <Home className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-white">Receiver</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="text-white font-medium">{receiverName}</div>
            <div className="text-white/60">Bangalore, Karnataka - 560001</div>
          </div>
        </div>
      </div>

      {/* Live Tracking Map */}
      {showLiveMap && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Navigation className="w-5 h-5 text-brand-400" />
              Live Tracking
            </h3>
            <button
              onClick={() => setShowLiveMap(false)}
              className="btn-icon p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="aspect-video bg-gradient-to-br from-brand-500/10 to-blue-500/10 rounded-xl border border-brand-500/20 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-brand-400/50 mx-auto mb-3" />
              <p className="text-white/40">Live map integration coming soon</p>
              <p className="text-white/20 text-sm">Real-time GPS tracking will be available here</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tracking Timeline */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-white">Delivery Timeline</h3>
          {!showLiveMap && (
            <button
              onClick={() => setShowLiveMap(true)}
              className="btn-secondary text-sm gap-2"
            >
              <Navigation className="w-4 h-4" />
              Live Map
            </button>
          )}
        </div>

        <div className="space-y-4">
          {updates.map((update, index) => {
            const IconComponent = STATUS_CONFIG[update.status as keyof typeof STATUS_CONFIG]?.icon || Package
            const config = STATUS_CONFIG[update.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending
            const formatted = formatTimestamp(update.timestamp)
            
            return (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'flex gap-4 p-4 rounded-xl border transition-all cursor-pointer',
                  update.isCompleted 
                    ? 'border-white/[0.08] bg-white/[0.02]' 
                    : 'border-brand-500/40 bg-brand-500/10'
                )}
                onClick={() => setSelectedUpdate(update)}
              >
                <div className="relative">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    update.isCompleted ? config.bgColor : 'bg-brand-500/20'
                  )}>
                    <IconComponent className={cn(
                      'w-5 h-5',
                      update.isCompleted ? config.color : 'text-brand-400'
                    )} />
                  </div>
                  
                  {/* Connection line */}
                  {index < updates.length - 1 && (
                    <div className="absolute top-10 left-5 w-0.5 h-16 bg-white/[0.08]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-white mb-1">
                        {config.label}
                      </h4>
                      <p className="text-white/60 text-sm">
                        {update.description}
                      </p>
                      {update.location && (
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-white/40" />
                          <span className="text-white/40 text-xs">{update.location}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <div className="text-white/40 text-xs">{formatted.time}</div>
                      <div className="text-white/60 text-xs">{formatted.relative}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onContactSupport}
          className="btn-secondary flex-1 gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          Contact Support
        </button>
        
        <button
          onClick={onReportIssue}
          className="btn-secondary flex-1 gap-2"
        >
          <AlertCircle className="w-4 h-4" />
          Report Issue
        </button>
        
        <button className="btn-primary flex-1 gap-2">
          <Phone className="w-4 h-4" />
          Call Courier
        </button>
      </div>

      {/* Update Detail Modal */}
      <AnimatePresence>
        {selectedUpdate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedUpdate(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-white/[0.08]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Update Details</h3>
                <button
                  onClick={() => setSelectedUpdate(null)}
                  className="btn-icon p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-white/40 text-sm">Status</span>
                  <div className="font-medium text-white">
                    {STATUS_CONFIG[selectedUpdate.status as keyof typeof STATUS_CONFIG]?.label}
                  </div>
                </div>

                <div>
                  <span className="text-white/40 text-sm">Description</span>
                  <div className="text-white/80">{selectedUpdate.description}</div>
                </div>

                {selectedUpdate.location && (
                  <div>
                    <span className="text-white/40 text-sm">Location</span>
                    <div className="text-white/80">{selectedUpdate.location}</div>
                  </div>
                )}

                <div>
                  <span className="text-white/40 text-sm">Timestamp</span>
                  <div className="text-white/80">
                    {formatTimestamp(selectedUpdate.timestamp).date} at {formatTimestamp(selectedUpdate.timestamp).time}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
