'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, Download, Heart, Eye, Star, Filter, Grid, List, ChevronLeft, ChevronRight, FileText, Image as ImageIcon, Maximize2, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface HandwritingSample {
  id: string
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

interface HandwritingPortfolioProps {
  writerId: string
  writerName: string
  samples: HandwritingSample[]
  isOwnPortfolio?: boolean
  onUploadSample?: () => void
}

const SAMPLE_TYPE_COLORS = {
  assignment: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
  notes: 'bg-green-500/15 text-green-300 border-green-500/20',
  diagram: 'bg-purple-500/15 text-purple-300 border-purple-500/20',
  math: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
  creative: 'bg-pink-500/15 text-pink-300 border-pink-500/20',
  other: 'bg-gray-500/15 text-gray-300 border-gray-500/20'
}

const SAMPLE_TYPE_ICONS = {
  assignment: '📝',
  notes: '📚',
  diagram: '📊',
  math: '🔢',
  creative: '🎨',
  other: '📄'
}

export default function HandwritingPortfolio({
  writerId,
  writerName,
  samples,
  isOwnPortfolio = false,
  onUploadSample
}: HandwritingPortfolioProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedSample, setSelectedSample] = useState<HandwritingSample | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [filterType, setFilterType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'quality' | 'popular'>('newest')
  const [likedSamples, setLikedSamples] = useState<Set<string>>(new Set())

  const filteredAndSortedSamples = samples
    .filter(sample => filterType === 'all' || sample.sample_type === filterType)
    .sort((a, b) => {
      switch (sortBy) {
        case 'quality':
          return b.overall_quality - a.overall_quality
        case 'popular':
          return b.likes - a.likes
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  const handleLike = (sampleId: string) => {
    const newLikedSamples = new Set(likedSamples)
    if (newLikedSamples.has(sampleId)) {
      newLikedSamples.delete(sampleId)
      toast.success('Removed from favorites')
    } else {
      newLikedSamples.add(sampleId)
      toast.success('Added to favorites')
    }
    setLikedSamples(newLikedSamples)
  }

  const openImageModal = (sample: HandwritingSample, index: number) => {
    setSelectedSample(sample)
    setCurrentImageIndex(index)
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    const currentIndex = filteredAndSortedSamples.findIndex(s => s.id === selectedSample?.id)
    if (direction === 'prev' && currentIndex > 0) {
      const newSample = filteredAndSortedSamples[currentIndex - 1]
      setSelectedSample(newSample)
      setCurrentImageIndex(currentIndex - 1)
    } else if (direction === 'next' && currentIndex < filteredAndSortedSamples.length - 1) {
      const newSample = filteredAndSortedSamples[currentIndex + 1]
      setSelectedSample(newSample)
      setCurrentImageIndex(currentIndex + 1)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-white mb-1">Handwriting Portfolio</h2>
          <p className="text-white/40 text-sm">
            {samples.length} samples • showcasing {writerName}'s writing expertise
          </p>
        </div>
        
        {isOwnPortfolio && onUploadSample && (
          <button onClick={onUploadSample} className="btn-primary gap-2">
            <Upload className="w-4 h-4" />
            Upload Sample
          </button>
        )}
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="select text-sm"
          >
            <option value="all">All Types</option>
            <option value="assignment">Assignments</option>
            <option value="notes">Notes</option>
            <option value="diagram">Diagrams</option>
            <option value="math">Mathematics</option>
            <option value="creative">Creative</option>
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="select text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="quality">Highest Quality</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>

        <div className="flex gap-1 p-1 bg-white/[0.04] rounded-lg border border-white/[0.08]">
          <button
            onClick={() => setViewMode('grid')}
            className={cn('p-1.5 rounded transition-all', viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/30')}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn('p-1.5 rounded transition-all', viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/30')}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Portfolio Grid/List */}
      {filteredAndSortedSamples.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">📝</div>
          <h3 className="font-semibold text-white mb-2">No samples found</h3>
          <p className="text-white/40 text-sm">
            {filterType !== 'all' ? 'Try changing the filter' : 'No handwriting samples uploaded yet'}
          </p>
        </div>
      ) : (
        <div className={cn(
          'gap-4',
          viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'flex flex-col'
        )}>
          {filteredAndSortedSamples.map((sample, index) => (
            <motion.div
              key={sample.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'group cursor-pointer overflow-hidden border border-white/[0.08] rounded-xl transition-all hover:border-brand-500/40',
                viewMode === 'list' ? 'flex gap-4 p-4' : 'aspect-[3/4]'
              )}
              onClick={() => openImageModal(sample, index)}
            >
              {/* Sample Image */}
              <div className={cn(
                'relative overflow-hidden bg-gradient-to-br from-amber-500/10 to-orange-500/10',
                viewMode === 'list' ? 'w-24 h-32 rounded-lg flex-shrink-0' : 'w-full h-48'
              )}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-amber-400/30" />
                </div>
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-white" />
                </div>

                {/* Type badge */}
                <div className="absolute top-2 left-2">
                  <span className={cn(
                    'px-2 py-1 rounded-lg text-xs font-medium border',
                    SAMPLE_TYPE_COLORS[sample.sample_type]
                  )}>
                    {SAMPLE_TYPE_ICONS[sample.sample_type]} {sample.sample_type}
                  </span>
                </div>

                {/* Quality indicator */}
                <div className="absolute top-2 right-2">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-white font-medium">{sample.overall_quality}</span>
                  </div>
                </div>
              </div>

              {/* Sample Info */}
              <div className={cn(
                'p-3',
                viewMode === 'list' ? 'flex-1' : ''
              )}>
                <h3 className="font-medium text-white text-sm mb-1 truncate">{sample.title}</h3>
                {sample.description && (
                  <p className="text-white/40 text-xs mb-2 line-clamp-2">{sample.description}</p>
                )}

                {/* Sample Details */}
                <div className="flex items-center gap-3 text-xs text-white/50 mb-2">
                  <span>✍️ {sample.writing_size}</span>
                  {sample.pen_color && <span>🖊️ {sample.pen_color}</span>}
                  {sample.paper_type && <span>📄 {sample.paper_type}</span>}
                </div>

                {/* Quality Metrics */}
                <div className="grid grid-cols-3 gap-1 mb-3 text-xs">
                  <div className="text-center">
                    <div className="text-white/60">Neatness</div>
                    <div className="font-medium text-white">{sample.neatness_rating}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white/60">Readability</div>
                    <div className="font-medium text-white">{sample.readability_rating}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white/60">Quality</div>
                    <div className="font-medium text-amber-400">{sample.overall_quality}</div>
                  </div>
                </div>

                {/* Engagement */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-white/40">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {sample.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className={cn('w-3 h-3', likedSamples.has(sample.id) ? 'fill-red-400 text-red-400' : '')} />
                      {sample.likes + (likedSamples.has(sample.id) ? 1 : 0)}
                    </span>
                  </div>
                  <span className="text-xs text-white/30">
                    {new Date(sample.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Like button (only show in list view) */}
              {viewMode === 'list' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleLike(sample.id)
                  }}
                  className="p-2 text-white/40 hover:text-red-400 transition-colors"
                >
                  <Heart className={cn('w-4 h-4', likedSamples.has(sample.id) ? 'fill-red-400 text-red-400' : '')} />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedSample && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedSample(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-6xl w-full h-full flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-4">
                  <h3 className="font-semibold text-white">{selectedSample.title}</h3>
                  <span className={cn(
                    'px-2 py-1 rounded-lg text-xs font-medium border',
                    SAMPLE_TYPE_COLORS[selectedSample.sample_type]
                  )}>
                    {SAMPLE_TYPE_ICONS[selectedSample.sample_type]} {selectedSample.sample_type}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLike(selectedSample.id)}
                    className="btn-icon p-2"
                  >
                    <Heart className={cn('w-5 h-5', likedSamples.has(selectedSample.id) ? 'fill-red-400 text-red-400' : 'text-white/60')} />
                  </button>
                  <button className="btn-icon p-2">
                    <Download className="w-5 h-5 text-white/60" />
                  </button>
                  <button className="btn-icon p-2">
                    <Maximize2 className="w-5 h-5 text-white/60" />
                  </button>
                  <button
                    onClick={() => setSelectedSample(null)}
                    className="btn-icon p-2"
                  >
                    <X className="w-5 h-5 text-white/60" />
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="relative max-w-4xl w-full">
                  {/* Navigation */}
                  {filteredAndSortedSamples.length > 1 && (
                    <>
                      <button
                        onClick={() => navigateImage('prev')}
                        disabled={currentImageIndex === 0}
                        className="absolute left-4 top-1/2 -translate-y-1/2 btn-icon p-3 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => navigateImage('next')}
                        disabled={currentImageIndex === filteredAndSortedSamples.length - 1}
                        className="absolute right-4 top-1/2 -translate-y-1/2 btn-icon p-3 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  {/* Image Container */}
                  <div className="aspect-[3/4] bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20 flex items-center justify-center">
                    <ImageIcon className="w-24 h-24 text-amber-400/30" />
                  </div>

                  {/* Image Counter */}
                  {filteredAndSortedSamples.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-white">
                      {currentImageIndex + 1} / {filteredAndSortedSamples.length}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer with Details */}
              <div className="border-t border-white/[0.08] p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Description */}
                  <div>
                    <h4 className="font-medium text-white mb-2">Description</h4>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {selectedSample.description || 'No description provided for this handwriting sample.'}
                    </p>
                  </div>

                  {/* Quality Metrics */}
                  <div>
                    <h4 className="font-medium text-white mb-2">Quality Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Neatness</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-400 rounded-full"
                              style={{ width: `${(selectedSample.neatness_rating / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-white font-medium">{selectedSample.neatness_rating}/5</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Readability</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-400 rounded-full"
                              style={{ width: `${(selectedSample.readability_rating / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-white font-medium">{selectedSample.readability_rating}/5</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Overall Quality</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full"
                              style={{ width: `${(selectedSample.overall_quality / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-amber-400 font-medium">{selectedSample.overall_quality}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sample Details */}
                  <div>
                    <h4 className="font-medium text-white mb-2">Details</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/60">Writing Size</span>
                        <span className="text-white capitalize">{selectedSample.writing_size}</span>
                      </div>
                      {selectedSample.pen_color && (
                        <div className="flex justify-between">
                          <span className="text-white/60">Pen Color</span>
                          <span className="text-white">{selectedSample.pen_color}</span>
                        </div>
                      )}
                      {selectedSample.paper_type && (
                        <div className="flex justify-between">
                          <span className="text-white/60">Paper Type</span>
                          <span className="text-white">{selectedSample.paper_type}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-white/60">Views</span>
                        <span className="text-white">{selectedSample.views}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Likes</span>
                        <span className="text-white">{selectedSample.likes + (likedSamples.has(selectedSample.id) ? 1 : 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Uploaded</span>
                        <span className="text-white">{new Date(selectedSample.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
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
