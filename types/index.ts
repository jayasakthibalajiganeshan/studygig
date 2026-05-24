export type UserRole = 'student' | 'tutor' | 'writer' | 'student_tutor' | 'companion' | 'project_dev' | 'craft_maker' | 'admin'
export type EducationLevel = '10th' | '11th' | '12th' | 'UG' | 'PG'
export type OrderCategory = 'writing' | 'tutor' | 'student_tutor' | 'companion' | 'project' | 'craft' | 'custom'
export type OrderStatus = 'pending' | 'accepted' | 'in_progress' | 'review' | 'completed' | 'cancelled' | 'disputed'
export type SessionStatus = 'scheduled' | 'live' | 'completed' | 'cancelled' | 'missed'
export type PaymentStatus = 'pending' | 'escrow' | 'released' | 'refunded' | 'disputed'
export type PersonalityType = 'extrovert' | 'introvert' | 'ambivert'
export type DeliveryMode = 'online' | 'offline' | 'hybrid'
export type ProjectType = 'web_dev' | 'mobile_app' | 'ai_ml' | 'iot' | 'hardware' | 'science' | 'craft' | 'presentation' | 'other'
export type Complexity = 'beginner' | 'intermediate' | 'advanced' | 'expert'
export type NotificationType = 'order' | 'session' | 'message' | 'payment' | 'achievement' | 'social' | 'system'

export interface Profile {
  id: string
  username: string
  full_name: string
  email: string
  avatar_url?: string
  bio?: string
  role: UserRole
  education_level?: EducationLevel
  institution?: string
  city?: string
  state?: string
  phone?: string
  personality_type?: PersonalityType
  xp: number
  level: number
  reputation_score: number
  trust_score: number
  study_streak: number
  last_active_date?: string
  is_verified: boolean
  is_premium: boolean
  women_safe_mode: boolean
  anonymous_mode: boolean
  email_notifications: boolean
  push_notifications: boolean
  total_orders: number
  completed_orders: number
  total_earnings: number
  total_spent: number
  rating: number
  review_count: number
  followers_count: number
  following_count: number
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  user_id: string
  title: string
  description?: string
  category: OrderCategory
  subject?: string
  education_level?: EducationLevel
  hourly_rate?: number
  is_available: boolean
  views: number
  orders_count: number
  rating: number
  tags: string[]
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Order {
  id: string
  order_number: string
  buyer_id: string
  seller_id?: string
  skill_id?: string
  title: string
  description: string
  category: OrderCategory
  status: OrderStatus
  education_level?: EducationLevel
  subject?: string
  topic?: string
  page_count?: number
  word_count?: number
  writing_type?: string
  weekly_sessions?: number
  preferred_timings?: string
  delivery_mode: DeliveryMode
  project_type?: ProjectType
  complexity?: Complexity
  technologies?: string[]
  team_size?: number
  base_price: number
  urgency_multiplier: number
  platform_commission?: number
  seller_amount?: number
  total_price: number
  deadline?: string
  delivery_days?: number
  started_at?: string
  completed_at?: string
  payment_status: PaymentStatus
  payment_id?: string
  requirements?: string
  attachments: string[]
  notes?: string
  revision_count: number
  max_revisions: number
  created_at: string
  updated_at: string
  buyer?: Profile
  seller?: Profile
}

export interface Session {
  id: string
  order_id?: string
  tutor_id: string
  student_id: string
  title: string
  description?: string
  subject?: string
  topic?: string
  status: SessionStatus
  delivery_mode: DeliveryMode
  scheduled_at: string
  duration_minutes: number
  actual_start?: string
  actual_end?: string
  meet_link?: string
  recording_url?: string
  student_attended: boolean
  tutor_attended: boolean
  student_rating?: number
  tutor_rating?: number
  student_review?: string
  tutor_review?: string
  notes?: string
  price?: number
  created_at: string
  updated_at: string
  tutor?: Profile
  student?: Profile
}

export interface Wallet {
  id: string
  user_id: string
  balance: number
  escrow_balance: number
  pending_payout: number
  total_earned: number
  total_spent: number
  updated_at: string
}

export interface Transaction {
  id: string
  wallet_id: string
  user_id: string
  order_id?: string
  type: 'credit' | 'debit' | 'escrow_hold' | 'escrow_release' | 'refund' | 'commission' | 'payout'
  amount: number
  balance_after?: number
  description: string
  payment_method?: string
  payment_id?: string
  razorpay_order_id?: string
  status: PaymentStatus
  created_at: string
}

export interface DemandPost {
  id: string
  user_id: string
  title: string
  description: string
  category: OrderCategory
  subject?: string
  topic?: string
  education_level?: EducationLevel
  budget_min?: number
  budget_max?: number
  deadline?: string
  is_urgent: boolean
  is_open: boolean
  views: number
  proposals_count: number
  tags: string[]
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Post {
  id: string
  user_id: string
  content: string
  post_type: 'update' | 'achievement' | 'project' | 'doubt' | 'resource'
  image_urls: string[]
  file_url?: string
  tags: string[]
  subject?: string
  likes_count: number
  comments_count: number
  saves_count: number
  shares_count: number
  views: number
  is_pinned: boolean
  created_at: string
  updated_at: string
  profiles?: Profile
  liked?: boolean
  saved?: boolean
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  link?: string
  is_read: boolean
  metadata: Record<string, unknown>
  created_at: string
}

export interface SupportTicket {
  id: string
  ticket_number: string
  user_id: string
  order_id?: string
  subject: string
  description: string
  category: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assigned_to?: string
  resolved_at?: string
  resolution_note?: string
  created_at: string
  updated_at: string
}

export interface Badge {
  id: string
  name: string
  description?: string
  icon: string
  xp_reward: number
  condition_type?: string
  condition_value?: number
}

// ---- Pricing Engine Types ----

export interface PriceBreakdown {
  base: number
  urgencyMultiplier: number
  deliveryFee: number
  platformCommission: number
  sellerAmount: number
  total: number
}

export interface OrderFormData {
  category: OrderCategory
  title: string
  description: string
  subject: string
  topic: string
  educationLevel: EducationLevel
  // Writing
  pageCount?: number
  wordCount?: number
  writingType?: string
  // Tutor
  weeklySessions?: number
  preferredTimings?: string
  deliveryMode?: DeliveryMode
  // Project
  projectType?: ProjectType
  complexity?: Complexity
  technologies?: string[]
  teamSize?: number
  // Common
  deadline?: Date
  deliveryDays?: number
  urgency?: 'normal' | 'fast' | 'urgent'
  requirements?: string
}

// ---- Writing Marketplace Types ----

export interface WriterProfile {
  id: string
  user_id: string
  handwriting_style?: string
  handwriting_quality_score: number
  pen_colors: string[]
  writing_speed: 'slow' | 'medium' | 'fast'
  paper_preferences: string[]
  portfolio_images: string[]
  portfolio_pdfs: string[]
  sample_work_description?: string
  subjects: string[]
  writing_types: string[]
  education_levels: EducationLevel[]
  supports_physical_delivery: boolean
  delivery_areas: string[]
  preferred_couriers: string[]
  base_price_per_page?: number
  urgent_delivery_fee: number
  physical_delivery_fee: number
  avg_handwriting_rating: number
  total_handwriting_reviews: number
  on_time_delivery_rate: number
  is_available: boolean
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface HandwritingSample {
  id: string
  writer_id: string
  title: string
  description?: string
  image_url: string
  sample_type: 'assignment' | 'notes' | 'diagram' | 'math' | 'creative' | 'other'
  neatness_rating: number
  readability_rating: number
  overall_quality: number
  pen_color?: string
  paper_type?: string
  writing_size: 'small' | 'medium' | 'large'
  views: number
  likes: number
  created_at: string
}

export interface PhysicalDelivery {
  id: string
  order_id: string
  sender_name: string
  sender_phone?: string
  sender_address: string
  sender_city: string
  sender_state: string
  sender_pincode: string
  receiver_name: string
  receiver_phone?: string
  receiver_address: string
  receiver_city: string
  receiver_state: string
  receiver_pincode: string
  courier_service?: string
  tracking_id?: string
  estimated_delivery?: string
  actual_delivery?: string
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'returned' | 'lost'
  status_updates: Record<string, unknown>
  shipping_cost: number
  insurance_cost: number
  created_at: string
  updated_at: string
}

export interface DeliveryUpdate {
  id: string
  delivery_id: string
  status: string
  location?: string
  description?: string
  timestamp: string
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> }
      orders: { Row: Order; Insert: Partial<Order>; Update: Partial<Order> }
      sessions: { Row: Session; Insert: Partial<Session>; Update: Partial<Session> }
      wallets: { Row: Wallet; Insert: Partial<Wallet>; Update: Partial<Wallet> }
      transactions: { Row: Transaction; Insert: Partial<Transaction>; Update: Partial<Transaction> }
      demand_posts: { Row: DemandPost; Insert: Partial<DemandPost>; Update: Partial<DemandPost> }
      posts: { Row: Post; Insert: Partial<Post>; Update: Partial<Post> }
      notifications: { Row: Notification; Insert: Partial<Notification>; Update: Partial<Notification> }
      support_tickets: { Row: SupportTicket; Insert: Partial<SupportTicket>; Update: Partial<SupportTicket> }
      writer_profiles: { Row: WriterProfile; Insert: Partial<WriterProfile>; Update: Partial<WriterProfile> }
      handwriting_samples: { Row: HandwritingSample; Insert: Partial<HandwritingSample>; Update: Partial<HandwritingSample> }
      physical_deliveries: { Row: PhysicalDelivery; Insert: Partial<PhysicalDelivery>; Update: Partial<PhysicalDelivery> }
      delivery_updates: { Row: DeliveryUpdate; Insert: Partial<DeliveryUpdate>; Update: Partial<DeliveryUpdate> }
    }
  }
}
