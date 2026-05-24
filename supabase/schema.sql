-- ============================================================
-- STUDYGIG COMPLETE DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('student', 'tutor', 'writer', 'student_tutor', 'companion', 'project_dev', 'craft_maker', 'admin');
CREATE TYPE education_level AS ENUM ('10th', '11th', '12th', 'UG', 'PG');
CREATE TYPE order_category AS ENUM ('writing', 'tutor', 'student_tutor', 'companion', 'project', 'craft', 'custom');
CREATE TYPE order_status AS ENUM ('pending', 'accepted', 'in_progress', 'review', 'completed', 'cancelled', 'disputed');
CREATE TYPE session_status AS ENUM ('scheduled', 'live', 'completed', 'cancelled', 'missed');
CREATE TYPE payment_status AS ENUM ('pending', 'escrow', 'released', 'refunded', 'disputed');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE personality_type AS ENUM ('extrovert', 'introvert', 'ambivert');
CREATE TYPE delivery_mode AS ENUM ('online', 'offline', 'hybrid');
CREATE TYPE project_type AS ENUM ('web_dev', 'mobile_app', 'ai_ml', 'iot', 'hardware', 'science', 'craft', 'presentation', 'other');
CREATE TYPE complexity AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE notification_type AS ENUM ('order', 'session', 'message', 'payment', 'achievement', 'social', 'system');

-- ============================================================
-- PROFILES TABLE
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  role user_role NOT NULL DEFAULT 'student',
  education_level education_level,
  institution TEXT,
  city TEXT,
  state TEXT,
  phone TEXT,
  personality_type personality_type DEFAULT 'ambivert',
  
  -- Gamification
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  reputation_score DECIMAL(3,2) DEFAULT 0,
  trust_score DECIMAL(3,2) DEFAULT 5.0,
  study_streak INTEGER DEFAULT 0,
  last_active_date DATE,
  
  -- Flags
  is_verified BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  women_safe_mode BOOLEAN DEFAULT false,
  anonymous_mode BOOLEAN DEFAULT false,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  
  -- Stats
  total_orders INTEGER DEFAULT 0,
  completed_orders INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  
  -- Social
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SKILLS TABLE
-- ============================================================

CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category order_category NOT NULL,
  subject TEXT,
  education_level education_level,
  hourly_rate DECIMAL(10,2),
  is_available BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0,
  orders_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ORDERS TABLE
-- ============================================================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  buyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,
  
  -- Order details
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category order_category NOT NULL,
  status order_status DEFAULT 'pending',
  education_level education_level,
  subject TEXT,
  topic TEXT,
  
  -- Writing specific
  page_count INTEGER,
  word_count INTEGER,
  writing_type TEXT,
  
  -- Tutor specific
  weekly_sessions INTEGER,
  preferred_timings TEXT,
  delivery_mode delivery_mode DEFAULT 'online',
  
  -- Project specific
  project_type project_type,
  complexity complexity,
  technologies TEXT[],
  team_size INTEGER,
  
  -- Pricing
  base_price DECIMAL(10,2) NOT NULL,
  urgency_multiplier DECIMAL(4,2) DEFAULT 1.0,
  platform_commission DECIMAL(10,2),
  seller_amount DECIMAL(10,2),
  total_price DECIMAL(10,2) NOT NULL,
  
  -- Timeline
  deadline TIMESTAMPTZ,
  delivery_days INTEGER,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Payment
  payment_status payment_status DEFAULT 'pending',
  payment_id TEXT,
  
  -- Meta
  requirements TEXT,
  attachments TEXT[] DEFAULT '{}',
  notes TEXT,
  revision_count INTEGER DEFAULT 0,
  max_revisions INTEGER DEFAULT 2,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SESSIONS TABLE
-- ============================================================

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  tutor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT,
  topic TEXT,
  
  status session_status DEFAULT 'scheduled',
  delivery_mode delivery_mode DEFAULT 'online',
  
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  
  meet_link TEXT,
  recording_url TEXT,
  
  student_attended BOOLEAN DEFAULT false,
  tutor_attended BOOLEAN DEFAULT false,
  
  student_rating INTEGER CHECK (student_rating BETWEEN 1 AND 5),
  tutor_rating INTEGER CHECK (tutor_rating BETWEEN 1 AND 5),
  student_review TEXT,
  tutor_review TEXT,
  
  notes TEXT,
  price DECIMAL(10,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DEMAND BOARD TABLE
-- ============================================================

CREATE TABLE demand_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category order_category NOT NULL,
  subject TEXT,
  topic TEXT,
  education_level education_level,
  
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  deadline TIMESTAMPTZ,
  
  is_urgent BOOLEAN DEFAULT false,
  is_open BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0,
  proposals_count INTEGER DEFAULT 0,
  
  tags TEXT[] DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROPOSALS TABLE
-- ============================================================

CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  demand_post_id UUID REFERENCES demand_posts(id) ON DELETE CASCADE,
  proposer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  message TEXT NOT NULL,
  proposed_price DECIMAL(10,2) NOT NULL,
  delivery_days INTEGER,
  is_accepted BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- WALLET & TRANSACTIONS
-- ============================================================

CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  balance DECIMAL(10,2) DEFAULT 0,
  escrow_balance DECIMAL(10,2) DEFAULT 0,
  pending_payout DECIMAL(10,2) DEFAULT 0,
  total_earned DECIMAL(10,2) DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit', 'escrow_hold', 'escrow_release', 'refund', 'commission', 'payout')),
  amount DECIMAL(10,2) NOT NULL,
  balance_after DECIMAL(10,2),
  
  description TEXT NOT NULL,
  payment_method TEXT,
  payment_id TEXT,
  razorpay_order_id TEXT,
  
  status payment_status DEFAULT 'pending',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MESSAGES / CHAT
-- ============================================================

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  participant_ids UUID[] NOT NULL,
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'audio', 'system')),
  file_url TEXT,
  is_read BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SOCIAL - POSTS
-- ============================================================

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL,
  post_type TEXT DEFAULT 'update' CHECK (post_type IN ('update', 'achievement', 'project', 'doubt', 'resource')),
  image_urls TEXT[] DEFAULT '{}',
  file_url TEXT,
  
  tags TEXT[] DEFAULT '{}',
  subject TEXT,
  
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  saves_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  
  is_pinned BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE TABLE post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE post_saves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- ============================================================
-- SOCIAL - FOLLOWS
-- ============================================================

CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- ============================================================
-- ACHIEVEMENTS & BADGES
-- ============================================================

CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  xp_reward INTEGER DEFAULT 0,
  condition_type TEXT,
  condition_value INTEGER
);

CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- ============================================================
-- REVIEWS
-- ============================================================

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  content TEXT,
  
  communication_rating INTEGER CHECK (communication_rating BETWEEN 1 AND 5),
  quality_rating INTEGER CHECK (quality_rating BETWEEN 1 AND 5),
  timeliness_rating INTEGER CHECK (timeliness_rating BETWEEN 1 AND 5),
  
  is_verified BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SUPPORT TICKETS
-- ============================================================

CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  status ticket_status DEFAULT 'open',
  priority ticket_priority DEFAULT 'medium',
  
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  resolution_note TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ticket_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_staff BOOLEAN DEFAULT false,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- COMPANION MATCHING
-- ============================================================

CREATE TABLE companion_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  study_goals TEXT[],
  preferred_subjects TEXT[],
  availability JSONB DEFAULT '{}',
  session_preferences TEXT,
  personality_type personality_type,
  languages TEXT[] DEFAULT '{"English"}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE companion_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  matched_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  match_score DECIMAL(5,2),
  is_accepted BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, matched_user_id)
);

-- ============================================================
-- WRITING MARKETPLACE ENHANCEMENTS
-- ============================================================

-- Writer profiles with handwriting samples and portfolio
CREATE TABLE writer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Handwriting details
  handwriting_style TEXT,
  handwriting_quality_score DECIMAL(3,2) DEFAULT 0 CHECK (handwriting_quality_score BETWEEN 0 AND 5),
  pen_colors TEXT[] DEFAULT '{"Black", "Blue"}',
  writing_speed TEXT CHECK (writing_speed IN ('slow', 'medium', 'fast')),
  paper_preferences TEXT[] DEFAULT '{"A4"}',
  
  -- Portfolio
  portfolio_images TEXT[] DEFAULT '{}',
  portfolio_pdfs TEXT[] DEFAULT '{}',
  sample_work_description TEXT,
  
  -- Specializations
  subjects TEXT[] DEFAULT '{}',
  writing_types TEXT[] DEFAULT '{}',
  education_levels education_level[] DEFAULT '{}',
  
  -- Delivery capabilities
  supports_physical_delivery BOOLEAN DEFAULT false,
  delivery_areas TEXT[] DEFAULT '{}',
  preferred_couriers TEXT[] DEFAULT '{}',
  
  -- Pricing
  base_price_per_page DECIMAL(5,2),
  urgent_delivery_fee DECIMAL(5,2) DEFAULT 0,
  physical_delivery_fee DECIMAL(5,2) DEFAULT 0,
  
  -- Quality metrics
  avg_handwriting_rating DECIMAL(3,2) DEFAULT 0,
  total_handwriting_reviews INTEGER DEFAULT 0,
  on_time_delivery_rate DECIMAL(5,2) DEFAULT 100,
  
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Handwriting samples for writers
CREATE TABLE handwriting_samples (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  writer_id UUID REFERENCES writer_profiles(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  sample_type TEXT CHECK (sample_type IN ('assignment', 'notes', 'diagram', 'math', 'creative', 'other')),
  
  -- Quality metrics
  neatness_rating DECIMAL(3,2) CHECK (neatness_rating BETWEEN 1 AND 5),
  readability_rating DECIMAL(3,2) CHECK (readability_rating BETWEEN 1 AND 5),
  overall_quality DECIMAL(3,2) CHECK (overall_quality BETWEEN 1 AND 5),
  
  -- Sample details
  pen_color TEXT,
  paper_type TEXT,
  writing_size TEXT CHECK (writing_size IN ('small', 'medium', 'large')),
  
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Physical delivery tracking
CREATE TABLE physical_deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  
  -- Addresses
  sender_name TEXT NOT NULL,
  sender_phone TEXT,
  sender_address TEXT NOT NULL,
  sender_city TEXT NOT NULL,
  sender_state TEXT NOT NULL,
  sender_pincode TEXT NOT NULL,
  
  receiver_name TEXT NOT NULL,
  receiver_phone TEXT,
  receiver_address TEXT NOT NULL,
  receiver_city TEXT NOT NULL,
  receiver_state TEXT NOT NULL,
  receiver_pincode TEXT NOT NULL,
  
  -- Delivery details
  courier_service TEXT,
  tracking_id TEXT,
  estimated_delivery TIMESTAMPTZ,
  actual_delivery TIMESTAMPTZ,
  
  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'returned', 'lost')),
  status_updates JSONB DEFAULT '{}',
  
  -- Cost
  shipping_cost DECIMAL(8,2) DEFAULT 0,
  insurance_cost DECIMAL(8,2) DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delivery status updates
CREATE TABLE delivery_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  delivery_id UUID REFERENCES physical_deliveries(id) ON DELETE CASCADE,
  
  status TEXT NOT NULL,
  location TEXT,
  description TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Writing order customizations
ALTER TABLE orders ADD COLUMN IF NOT EXISTS pen_color TEXT DEFAULT 'Black';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS handwriting_style TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS margin_style TEXT DEFAULT 'standard';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS diagram_support BOOLEAN DEFAULT false;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paper_format TEXT DEFAULT 'A4';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS requires_physical_delivery BOOLEAN DEFAULT false;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_instructions TEXT;

-- ============================================================
-- SEED BADGES
-- ============================================================

INSERT INTO badges (name, description, icon, xp_reward, condition_type, condition_value) VALUES
('First Order', 'Complete your first order', '🎯', 100, 'orders', 1),
('Study Streak 7', '7 day study streak', '🔥', 200, 'streak', 7),
('Top Tutor', 'Get 50 five-star reviews', '⭐', 500, 'reviews_5star', 50),
('Power Seller', 'Complete 25 orders', '💪', 300, 'orders', 25),
('Community Hero', 'Get 1000 post likes', '🦸', 400, 'post_likes', 1000),
('Verified Expert', 'Get verified badge', '✅', 150, 'verified', 1),
('Fast Delivery', 'Deliver 10 orders early', '⚡', 250, 'early_deliveries', 10),
('Study Master', '30 day study streak', '🏆', 1000, 'streak', 30),
('Social Star', 'Get 100 followers', '🌟', 200, 'followers', 100),
('Project Guru', 'Complete 10 projects', '🚀', 350, 'projects', 10);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, own write
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Orders: users see their own
CREATE POLICY "Users see own orders" ON orders FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Users create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Order parties can update" ON orders FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Wallets: own only
CREATE POLICY "Users see own wallet" ON wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own wallet" ON wallets FOR UPDATE USING (auth.uid() = user_id);

-- Notifications: own only
CREATE POLICY "Users see own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Posts: public read
CREATE POLICY "Posts are public" ON posts FOR SELECT USING (true);
CREATE POLICY "Users create own posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create wallet for new user
CREATE OR REPLACE FUNCTION create_wallet_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO wallets (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION create_wallet_for_user();

-- Update profile updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'SG-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('order_seq')::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE order_seq START 1000;
CREATE TRIGGER set_order_number BEFORE INSERT ON orders FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Generate ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ticket_number = 'TKT-' || LPAD(NEXTVAL('ticket_seq')::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE ticket_seq START 1000;
CREATE TRIGGER set_ticket_number BEFORE INSERT ON support_tickets FOR EACH ROW EXECUTE FUNCTION generate_ticket_number();
