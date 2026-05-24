'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Truck, MapPin, Clock, Package, Shield, Phone, Mail, User, Edit2, Check, AlertCircle, Calendar, Calculator, ChevronRight, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface AddressForm {
  name: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  pincode: string
  landmark?: string
}

interface DeliveryOptions {
  courier: string
  estimatedDays: number
  cost: number
  insurance: boolean
  tracking: boolean
}

interface PhysicalDeliveryFlowProps {
  orderId: string
  onDeliveryComplete: (deliveryDetails: any) => void
  onCancel: () => void
  writerSupportsPhysical: boolean
  writerDeliveryAreas: string[]
}

const COURIER_OPTIONS = [
  {
    id: 'standard',
    name: 'Standard Delivery',
    description: 'Reliable delivery within 5-7 days',
    estimatedDays: 5,
    baseCost: 40,
    icon: '📦',
    tracking: true,
    insurance: false
  },
  {
    id: 'express',
    name: 'Express Delivery',
    description: 'Fast delivery within 2-3 days',
    estimatedDays: 2,
    baseCost: 80,
    icon: '🚀',
    tracking: true,
    insurance: true
  },
  {
    id: 'premium',
    name: 'Premium Delivery',
    description: 'Same-day/Next-day delivery',
    estimatedDays: 1,
    baseCost: 150,
    icon: '⚡',
    tracking: true,
    insurance: true
  },
  {
    id: 'blinkit',
    name: 'Blinkit Hyperlocal',
    description: 'Instant delivery within hours',
    estimatedDays: 0,
    baseCost: 120,
    icon: '🛵',
    tracking: true,
    insurance: false
  }
]

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bangalore', 'Hyderabad', 'Pune', 'Ahmedabad'
]

export default function PhysicalDeliveryFlow({
  orderId,
  onDeliveryComplete,
  onCancel,
  writerSupportsPhysical,
  writerDeliveryAreas
}: PhysicalDeliveryFlowProps) {
  const [step, setStep] = useState(1)
  const [senderAddress, setSenderAddress] = useState<AddressForm>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  })
  const [receiverAddress, setReceiverAddress] = useState<AddressForm>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  })
  const [selectedCourier, setSelectedCourier] = useState(COURIER_OPTIONS[1]) // Default to Express
  const [addInsurance, setAddInsurance] = useState(false)
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const totalCost = selectedCourier.baseCost + (addInsurance ? 30 : 0)
  const estimatedDelivery = new Date()
  estimatedDelivery.setDate(estimatedDelivery.getDate() + selectedCourier.estimatedDays)

  const validateAddress = (address: AddressForm): boolean => {
    return !!(
      address.name &&
      address.phone &&
      address.email &&
      address.address &&
      address.city &&
      address.state &&
      address.pincode
    )
  }

  const handleNext = () => {
    if (step === 1 && !validateAddress(senderAddress)) {
      toast.error('Please fill in all sender address details')
      return
    }
    if (step === 2 && !validateAddress(receiverAddress)) {
      toast.error('Please fill in all receiver address details')
      return
    }
    if (step < 3) setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setIsProcessing(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const deliveryDetails = {
      orderId,
      sender: senderAddress,
      receiver: receiverAddress,
      courier: selectedCourier,
      insurance: addInsurance,
      instructions: specialInstructions,
      totalCost,
      estimatedDelivery: estimatedDelivery.toISOString()
    }
    
    onDeliveryComplete(deliveryDetails)
    setIsProcessing(false)
    toast.success('Delivery details confirmed! 📦')
  }

  const steps = [
    { number: 1, title: 'Sender Address', description: 'Your contact details' },
    { number: 2, title: 'Receiver Address', description: 'Writer\'s delivery location' },
    { number: 3, title: 'Delivery Options', description: 'Choose courier & speed' }
  ]

  const AddressFormComponent = ({ 
    address, 
    setAddress, 
    title, 
    description 
  }: { 
    address: AddressForm
    setAddress: (addr: AddressForm) => void
    title: string
    description: string 
  }) => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h3 className="font-display text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/40 text-sm">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label flex items-center gap-2">
            <User className="w-4 h-4" />
            Full Name *
          </label>
          <input
            type="text"
            value={address.name}
            onChange={e => setAddress({ ...address, name: e.target.value })}
            placeholder="Enter full name"
            className="input"
          />
        </div>

        <div>
          <label className="label flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone Number *
          </label>
          <input
            type="tel"
            value={address.phone}
            onChange={e => setAddress({ ...address, phone: e.target.value })}
            placeholder="+91 98765 43210"
            className="input"
          />
        </div>

        <div>
          <label className="label flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Address *
          </label>
          <input
            type="email"
            value={address.email}
            onChange={e => setAddress({ ...address, email: e.target.value })}
            placeholder="email@example.com"
            className="input"
          />
        </div>

        <div>
          <label className="label flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            PIN Code *
          </label>
          <input
            type="text"
            value={address.pincode}
            onChange={e => setAddress({ ...address, pincode: e.target.value })}
            placeholder="110001"
            maxLength={6}
            className="input"
          />
        </div>

        <div className="md:col-span-2">
          <label className="label flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Street Address *
          </label>
          <textarea
            value={address.address}
            onChange={e => setAddress({ ...address, address: e.target.value })}
            placeholder="House/Flat No., Building Name, Street, Area"
            rows={2}
            className="textarea"
          />
        </div>

        <div>
          <label className="label">City *</label>
          <input
            type="text"
            value={address.city}
            onChange={e => setAddress({ ...address, city: e.target.value })}
            placeholder="Mumbai"
            className="input"
          />
        </div>

        <div>
          <label className="label">State *</label>
          <select
            value={address.state}
            onChange={e => setAddress({ ...address, state: e.target.value })}
            className="select"
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="label">Landmark (Optional)</label>
          <input
            type="text"
            value={address.landmark}
            onChange={e => setAddress({ ...address, landmark: e.target.value })}
            placeholder="Near railway station, famous landmark, etc."
            className="input"
          />
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((s, index) => (
            <div key={s.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all',
                  step > s.number ? 'bg-emerald-500 text-white' :
                  step === s.number ? 'bg-brand-500 text-white' : 'bg-white/10 text-white/30'
                )}>
                  {step > s.number ? <Check className="w-5 h-5" /> : s.number}
                </div>
                <div className="mt-2 text-center">
                  <div className={cn(
                    'text-sm font-medium',
                    step === s.number ? 'text-white' : 'text-white/40'
                  )}>
                    {s.title}
                  </div>
                  <div className="text-xs text-white/30">{s.description}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  'flex-1 h-0.5 mx-4 rounded',
                  step > s.number ? 'bg-emerald-500' : 'bg-white/10'
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="card p-6 mb-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Sender Address */}
          {step === 1 && (
            <AddressFormComponent
              address={senderAddress}
              setAddress={setSenderAddress}
              title="Sender Address"
              description="Where will the notebook/record be sent from?"
            />
          )}

          {/* Step 2: Receiver Address */}
          {step === 2 && (
            <AddressFormComponent
              address={receiverAddress}
              setAddress={setReceiverAddress}
              title="Receiver Address"
              description="Where should the writer deliver the completed work?"
            />
          )}

          {/* Step 3: Delivery Options */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="font-display text-xl font-bold text-white mb-2">Choose Delivery Option</h3>
                <p className="text-white/40 text-sm">Select the best delivery method for your needs</p>
              </div>

              {/* Courier Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COURIER_OPTIONS.map((courier) => (
                  <button
                    key={courier.id}
                    onClick={() => setSelectedCourier(courier)}
                    className={cn(
                      'p-4 rounded-xl border text-left transition-all',
                      selectedCourier.id === courier.id
                        ? 'border-brand-500/40 bg-brand-500/10'
                        : 'border-white/[0.08] hover:border-white/20'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{courier.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-white mb-1">{courier.name}</div>
                        <div className="text-sm text-white/40 mb-2">{courier.description}</div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-white/40" />
                            <span className="text-sm text-white/60">
                              {courier.estimatedDays === 0 ? 'Same day' : `${courier.estimatedDays} days`}
                            </span>
                          </div>
                          <div className="font-bold text-brand-400">₹{courier.baseCost}</div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {courier.tracking && (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs">
                              📍 Live Tracking
                            </span>
                          )}
                          {courier.insurance && (
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs">
                              🛡️ Insured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Additional Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/[0.08]">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="font-medium text-white">Shipping Insurance</div>
                      <div className="text-sm text-white/40">Protect against loss or damage</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-white/60">+₹30</span>
                    <button
                      onClick={() => setAddInsurance(!addInsurance)}
                      className={cn(
                        'w-12 h-6 rounded-full transition-colors',
                        addInsurance ? 'bg-brand-500' : 'bg-white/10'
                      )}
                    >
                      <div className={cn(
                        'w-5 h-5 bg-white rounded-full transition-transform',
                        addInsurance ? 'translate-x-6' : 'translate-x-0.5'
                      )} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="label">Special Instructions (Optional)</label>
                  <textarea
                    value={specialInstructions}
                    onChange={e => setSpecialInstructions(e.target.value)}
                    placeholder="Any special handling instructions, delivery preferences, or notes for the courier..."
                    rows={3}
                    className="textarea"
                  />
                </div>
              </div>

              {/* Cost Summary */}
              <div className="bg-gradient-to-r from-brand-500/10 to-blue-500/10 rounded-xl p-4 border border-brand-500/20">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Cost Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Base Delivery Cost</span>
                    <span className="text-white">₹{selectedCourier.baseCost}</span>
                  </div>
                  {addInsurance && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Insurance</span>
                      <span className="text-white">₹30</span>
                    </div>
                  )}
                  <div className="h-px bg-white/[0.08] my-2" />
                  <div className="flex justify-between font-bold text-white">
                    <span>Total Cost</span>
                    <span className="text-brand-400">₹{totalCost}</span>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-emerald-500/10 rounded-lg">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs">
                    <Calendar className="w-3 h-3" />
                    Estimated delivery by {estimatedDelivery.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={step === 1 ? onCancel : handlePrevious}
          className="btn-secondary px-6"
        >
          {step === 1 ? 'Cancel' : 'Previous'}
        </button>

        {step < 3 ? (
          <button onClick={handleNext} className="btn-primary px-6 flex items-center gap-2">
            Next Step
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="btn-primary px-6 flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Package className="w-4 h-4" />
                Confirm Delivery
              </>
            )}
          </button>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-300">
            <strong>Important:</strong> Please ensure all addresses are accurate. The writer will receive your notebook/record and will return the completed work to the receiver address. Tracking information will be shared once the courier is booked.
          </div>
        </div>
      </div>
    </div>
  )
}
