'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  Lock, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  CreditCard, 
  Wallet,
  ArrowRight,
  ArrowLeft,
  Zap,
  Info,
  Timer,
  Eye,
  FileText,
  Users,
  TrendingUp
} from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface EscrowPaymentFlowProps {
  orderId: string
  orderAmount: number
  sellerName: string
  sellerAvatar: string
  sellerRating: number
  onPaymentComplete: (paymentDetails: any) => void
  onCancel: () => void
}

const PAYMENT_METHODS = [
  {
    id: 'upi',
    name: 'UPI',
    description: 'Pay via UPI apps (GPay, PhonePe, Paytm)',
    icon: '📱',
    fee: 0,
    processingTime: 'Instant'
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, RuPay',
    icon: '💳',
    fee: 2.5,
    processingTime: 'Instant'
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    description: 'All major Indian banks supported',
    icon: '🏦',
    fee: 0,
    processingTime: '5-10 mins'
  },
  {
    id: 'wallet',
    name: 'Wallet',
    description: 'Paytm, PhonePe, Amazon Pay',
    icon: '💰',
    fee: 1.5,
    processingTime: 'Instant'
  }
]

const ESCROW_STEPS = [
  {
    id: 1,
    title: 'Payment Held',
    description: 'Your payment is securely held in escrow',
    icon: Lock,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10'
  },
  {
    id: 2,
    title: 'Writer Works',
    description: 'Writer completes your handwriting work',
    icon: Users,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10'
  },
  {
    id: 3,
    title: 'Quality Check',
    description: 'Review the completed work',
    icon: Eye,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10'
  },
  {
    id: 4,
    title: 'Payment Released',
    description: 'Payment released to writer after approval',
    icon: CheckCircle,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10'
  }
]

export default function EscrowPaymentFlow({
  orderId,
  orderAmount,
  sellerName,
  sellerAvatar,
  sellerRating,
  onPaymentComplete,
  onCancel
}: EscrowPaymentFlowProps) {
  const [step, setStep] = useState(1)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(PAYMENT_METHODS[0])
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [countdown, setCountdown] = useState(300) // 5 minutes

  const platformFee = orderAmount * 0.25 // 25% platform fee
  const paymentMethodFee = orderAmount * (selectedPaymentMethod.fee / 100)
  const totalAmount = orderAmount + platformFee + paymentMethodFee

  useEffect(() => {
    if (step === 2 && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [step, countdown])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setPaymentComplete(true)
    setIsProcessing(false)
    
    // Move to next step after a delay
    setTimeout(() => {
      setStep(2)
    }, 2000)
  }

  const handleConfirmDelivery = () => {
    const paymentDetails = {
      orderId,
      amount: totalAmount,
      method: selectedPaymentMethod.id,
      escrowReleased: true,
      timestamp: new Date().toISOString()
    }
    
    onPaymentComplete(paymentDetails)
    toast.success('Payment released to writer! ✅')
  }

  const handleReportIssue = () => {
    toast.error('Opening dispute resolution...')
    // In real app, this would open dispute modal
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-2xl mb-4">
          <Shield className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="font-display text-2xl font-bold text-white mb-2">Secure Escrow Payment</h1>
        <p className="text-white/40">Your payment is protected until work is delivered and approved</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {ESCROW_STEPS.map((escrowStep, index) => (
            <div key={escrowStep.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center transition-all',
                  step > escrowStep.id ? 'bg-emerald-500/20 border border-emerald-500/30' :
                  step === escrowStep.id ? 'bg-brand-500/20 border border-brand-500/30' : 'bg-white/5 border border-white/10'
                )}>
                  <escrowStep.icon className={cn(
                    'w-6 h-6',
                    step > escrowStep.id ? 'text-emerald-400' :
                    step === escrowStep.id ? 'text-brand-400' : 'text-white/30'
                  )} />
                </div>
                <div className="mt-2 text-center max-w-[100px]">
                  <div className={cn(
                    'text-xs font-medium mb-1',
                    step === escrowStep.id ? 'text-white' : 'text-white/40'
                  )}>
                    {escrowStep.title}
                  </div>
                  <div className="text-xs text-white/30 line-clamp-2">
                    {escrowStep.description}
                  </div>
                </div>
              </div>
              {index < ESCROW_STEPS.length - 1 && (
                <div className={cn(
                  'flex-1 h-0.5 mx-2 rounded',
                  step > escrowStep.id ? 'bg-emerald-500/30' : 'bg-white/10'
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Payment Selection */}
        {step === 1 && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Order Summary */}
            <div className="card p-6">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={`https://api.dicebear.com/8.x/notionists/svg?seed=${sellerAvatar}&backgroundColor=b6e3f4`}
                  alt={sellerName}
                  className="w-12 h-12 rounded-xl"
                />
                <div>
                  <h3 className="font-semibold text-white">{sellerName}</h3>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <span>⭐ {sellerRating}</span>
                    <span>•</span>
                    <span>Verified Writer</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Order Amount</span>
                  <span className="text-white font-medium">₹{orderAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Platform Fee (25%)</span>
                  <span className="text-white font-medium">₹{platformFee.toLocaleString()}</span>
                </div>
                {paymentMethodFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/60">Payment Method Fee ({selectedPaymentMethod.fee}%)</span>
                    <span className="text-white font-medium">₹{paymentMethodFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="h-px bg-white/[0.08] my-2" />
                <div className="flex justify-between text-base">
                  <span className="font-semibold text-white">Total Amount</span>
                  <span className="font-display font-bold text-brand-400">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="card p-6">
              <h3 className="font-semibold text-white mb-4">Choose Payment Method</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method)}
                    className={cn(
                      'p-4 rounded-xl border text-left transition-all',
                      selectedPaymentMethod.id === method.id
                        ? 'border-brand-500/40 bg-brand-500/10'
                        : 'border-white/[0.08] hover:border-white/20'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{method.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium text-white mb-1">{method.name}</div>
                        <div className="text-sm text-white/40 mb-2">{method.description}</div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-white/60">
                            {method.processingTime}
                          </span>
                          {method.fee > 0 && (
                            <span className="text-xs text-amber-400">
                              +{method.fee}% fee
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-emerald-300">
                  <strong>100% Payment Protection:</strong> Your money is held in secure escrow until you confirm the work is completed to your satisfaction. If there are any issues, you can raise a dispute for resolution.
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button onClick={onCancel} className="btn-secondary px-6">
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={isProcessing || paymentComplete}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing Payment...
                  </>
                ) : paymentComplete ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Payment Successful
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Pay ₹{totalAmount.toLocaleString()}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Escrow Active */}
        {step === 2 && (
          <motion.div
            key="escrow"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Escrow Status */}
            <div className="card p-6 border-2 border-emerald-500/20 bg-emerald-500/5">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-2xl mb-4">
                  <Lock className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-2">Payment in Escrow</h3>
                <p className="text-white/40 mb-4">
                  ₹{totalAmount.toLocaleString()} is securely held until work completion
                </p>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-3 bg-white/[0.02] rounded-lg">
                    <div className="font-display font-bold text-emerald-400">₹{totalAmount.toLocaleString()}</div>
                    <div className="text-white/40">Escrow Amount</div>
                  </div>
                  <div className="text-center p-3 bg-white/[0.02] rounded-lg">
                    <div className="font-display font-bold text-amber-400">{formatTime(countdown)}</div>
                    <div className="text-white/40">Auto-release</div>
                  </div>
                  <div className="text-center p-3 bg-white/[0.02] rounded-lg">
                    <div className="font-display font-bold text-blue-400">Active</div>
                    <div className="text-white/40">Status</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Writer Progress */}
            <div className="card p-6">
              <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                Writer Progress
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Order Accepted</div>
                      <div className="text-sm text-white/40">Writer has accepted your order</div>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400">Completed</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                      <Timer className="w-4 h-4 text-amber-400 animate-pulse" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Work in Progress</div>
                      <div className="text-sm text-white/40">Writer is working on your order</div>
                    </div>
                  </div>
                  <span className="text-xs text-amber-400">In Progress</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg opacity-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <Eye className="w-4 h-4 text-white/30" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Quality Review</div>
                      <div className="text-sm text-white/40">Review and approve work</div>
                    </div>
                  </div>
                  <span className="text-xs text-white/30">Pending</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleReportIssue}
                className="btn-secondary gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                Report Issue
              </button>
              <button
                onClick={handleConfirmDelivery}
                className="btn-primary gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Approve & Release Payment
              </button>
            </div>

            {/* Info Note */}
            <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-300">
                  <strong>Important:</strong> Only approve the work if you're satisfied with the quality. Once payment is released, it cannot be reversed. If you have concerns, use the "Report Issue" button to raise a dispute.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
