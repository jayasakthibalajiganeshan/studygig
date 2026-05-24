'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, ArrowUpRight, ArrowDownLeft, Download, Plus, X, Loader2, CheckCircle, Lock, TrendingUp } from 'lucide-react'
import { MOCK_TRANSACTIONS } from '@/lib/mock-data'
import { formatPrice } from '@/lib/pricing'
import { formatDateTime, cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const MONTHLY_DATA = [
  { month: 'Jan', earned: 1200, spent: 800 },
  { month: 'Feb', earned: 2100, spent: 1200 },
  { month: 'Mar', earned: 1800, spent: 600 },
  { month: 'Apr', earned: 3200, spent: 1800 },
  { month: 'May', earned: 2800, spent: 900 },
  { month: 'Jun', earned: 4100, spent: 2100 },
  { month: 'Jul', earned: 3600, spent: 1500 },
]

export default function WalletPage() {
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [upiId, setUpiId] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'credit' | 'debit'>('all')

  const wallet = { balance: 5200, escrow: 7925, pending: 2400, total_earned: 18500, total_spent: 7200 }

  const filteredTxns = MOCK_TRANSACTIONS.filter(t => {
    if (activeTab === 'credit') return ['credit', 'escrow_release', 'refund'].includes(t.type)
    if (activeTab === 'debit') return ['debit', 'escrow_hold', 'commission'].includes(t.type)
    return true
  })

  const handleAddFunds = async () => {
    if (!amount || +amount < 100) return toast.error('Minimum top-up is ₹100')
    setLoading(true)
    await new Promise(r => setTimeout(r, 2000))
    toast.success(`₹${amount} added successfully via ${paymentMethod.toUpperCase()}! 🎉`)
    setShowAddFunds(false)
    setAmount('')
    setLoading(false)
  }

  const handleWithdraw = async () => {
    if (!amount || +amount < 500) return toast.error('Minimum withdrawal is ₹500')
    if (+amount > wallet.balance) return toast.error('Insufficient balance')
    setLoading(true)
    await new Promise(r => setTimeout(r, 2000))
    toast.success(`₹${amount} withdrawal initiated! Will reach bank in 1-2 days.`)
    setShowWithdraw(false)
    setAmount('')
    setLoading(false)
  }

  const handleExport = () => {
    toast.success('Statement exported as PDF! 📄')
  }

  const txnIcon = (type: string) => {
    if (['credit', 'escrow_release', 'refund'].includes(type)) return <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
    return <ArrowUpRight className="w-4 h-4 text-red-400" />
  }
  const txnColor = (type: string) => ['credit', 'escrow_release', 'refund'].includes(type) ? 'text-emerald-400' : 'text-red-400'
  const txnSign = (type: string) => ['credit', 'escrow_release', 'refund'].includes(type) ? '+' : '-'

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Wallet</h1>
          <p className="text-white/40 mt-1">Manage your earnings and payments</p>
        </div>
        <button onClick={handleExport} className="btn-secondary gap-2 text-sm">
          <Download className="w-4 h-4" /> Export Statement
        </button>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="card p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-violet-500/10" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="w-5 h-5 text-brand-400" />
              <span className="text-white/60 text-sm">Available Balance</span>
            </div>
            <div className="font-display text-3xl font-bold text-white mb-4">{formatPrice(wallet.balance)}</div>
            <div className="flex gap-2">
              <button onClick={() => setShowAddFunds(true)} className="btn-primary flex-1 justify-center py-2 text-xs">
                <Plus className="w-3.5 h-3.5" /> Add Funds
              </button>
              <button onClick={() => setShowWithdraw(true)} className="btn-secondary flex-1 justify-center py-2 text-xs">
                Withdraw
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="card p-6">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-5 h-5 text-yellow-400" />
            <span className="text-white/60 text-sm">In Escrow</span>
          </div>
          <div className="font-display text-3xl font-bold text-white mb-1">{formatPrice(wallet.escrow)}</div>
          <p className="text-xs text-white/30 leading-relaxed">Held securely until orders are completed</p>
          <div className="mt-3 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-xs text-yellow-400">🔒 Released upon delivery confirmation</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="card p-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span className="text-white/60 text-sm">Pending Payout</span>
          </div>
          <div className="font-display text-3xl font-bold text-white mb-1">{formatPrice(wallet.pending)}</div>
          <p className="text-xs text-white/30">Processing — arrives in 1-2 business days</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-white/[0.03]"><div className="text-white/30">Total Earned</div><div className="text-emerald-400 font-semibold">{formatPrice(wallet.total_earned)}</div></div>
            <div className="p-2 rounded-lg bg-white/[0.03]"><div className="text-white/30">Total Spent</div><div className="text-red-400 font-semibold">{formatPrice(wallet.total_spent)}</div></div>
          </div>
        </motion.div>
      </div>

      {/* Earnings chart */}
      <div className="card p-6">
        <h2 className="font-display font-semibold text-white mb-5">Monthly Overview</h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MONTHLY_DATA} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [`₹${v.toLocaleString()}`, '']} />
              <Bar dataKey="earned" fill="#6366f1" radius={[4, 4, 0, 0]} name="Earned" />
              <Bar dataKey="spent" fill="#f97316" radius={[4, 4, 0, 0]} name="Spent" opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction history */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-white">Transaction History</h2>
          <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/[0.08]">
            {(['all', 'credit', 'debit'] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize',
                  activeTab === t ? 'bg-white/10 text-white' : 'text-white/40')}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredTxns.map((txn, i) => (
            <motion.div key={txn.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                {txnIcon(txn.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-sm truncate">{txn.description}</div>
                <div className="flex items-center gap-2 text-xs text-white/30 mt-0.5">
                  <span>{formatDateTime(txn.created_at)}</span>
                  {txn.payment_method && <><span>·</span><span className="uppercase">{txn.payment_method}</span></>}
                </div>
              </div>
              <div className="text-right">
                <div className={cn('font-display font-bold text-sm', txnColor(txn.type))}>
                  {txnSign(txn.type)}₹{txn.amount.toLocaleString()}
                </div>
                <div className="text-xs text-white/30 capitalize">{txn.status}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTxns.length === 0 && (
          <div className="text-center py-10">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-white/40 text-sm">No transactions yet</p>
          </div>
        )}
      </div>

      {/* Add Funds Modal */}
      <AnimatePresence>
        {showAddFunds && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="card p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-white text-lg">Add Funds</h2>
                <button onClick={() => setShowAddFunds(false)} className="btn-icon p-1.5"><X className="w-4 h-4 text-white/60" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="label">Amount (₹)</label>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Min ₹100" className="input text-xl font-bold" />
                  <div className="flex gap-2 mt-2">
                    {[500, 1000, 2000, 5000].map(a => (
                      <button key={a} onClick={() => setAmount(String(a))} className="flex-1 py-1.5 rounded-lg border border-white/10 text-xs text-white/60 hover:border-brand-500/40 hover:text-brand-400 transition-all">₹{a}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ v: 'upi', l: '📱 UPI' }, { v: 'card', l: '💳 Card' }, { v: 'netbanking', l: '🏦 Net Banking' }, { v: 'wallet', l: '👝 Paytm/GPay' }].map(m => (
                      <button key={m.v} onClick={() => setPaymentMethod(m.v)}
                        className={cn('py-2.5 rounded-xl border text-sm transition-all', paymentMethod === m.v ? 'bg-brand-500/20 border-brand-500/40 text-brand-300' : 'border-white/10 text-white/50 hover:border-white/20')}>
                        {m.l}
                      </button>
                    ))}
                  </div>
                </div>
                {paymentMethod === 'upi' && (
                  <div>
                    <label className="label">UPI ID</label>
                    <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" className="input" />
                  </div>
                )}
                <div className="p-3 bg-white/[0.02] rounded-xl">
                  <div className="flex justify-between text-sm mb-1"><span className="text-white/40">Amount</span><span className="text-white">₹{amount || '0'}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-white/40">Processing fee</span><span className="text-white/40">Free</span></div>
                  <div className="h-px bg-white/[0.06] my-2" />
                  <div className="flex justify-between font-semibold"><span className="text-white">Total</span><span className="text-white">₹{amount || '0'}</span></div>
                </div>
                <button onClick={handleAddFunds} disabled={loading} className="btn-primary w-full justify-center py-3">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  {loading ? 'Processing...' : `Pay ₹${amount || '0'}`}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdraw && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="card p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-white text-lg">Withdraw Funds</h2>
                <button onClick={() => setShowWithdraw(false)} className="btn-icon p-1.5"><X className="w-4 h-4 text-white/60" /></button>
              </div>
              <div className="p-3 mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <div className="text-sm text-emerald-400">Available: {formatPrice(wallet.balance)}</div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="label">Withdrawal Amount (₹)</label>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Min ₹500" className="input" />
                </div>
                <div>
                  <label className="label">Bank Account / UPI</label>
                  <input placeholder="Bank IFSC + Account or UPI ID" className="input" />
                </div>
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-xs text-yellow-400">
                  ⚠️ Withdrawals are processed in 1-2 business days
                </div>
                <button onClick={handleWithdraw} disabled={loading} className="btn-primary w-full justify-center py-3">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}
                  {loading ? 'Processing...' : 'Withdraw'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
