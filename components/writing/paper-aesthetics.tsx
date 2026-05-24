'use client'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PaperProps {
  children: React.ReactNode
  variant?: 'lined' | 'blank' | 'grid' | 'dotted' | 'college'
  size?: 'a4' | 'a3' | 'letter' | 'notebook'
  margin?: 'none' | 'narrow' | 'standard' | 'wide'
  className?: string
  animated?: boolean
}

interface PenAnimationProps {
  isWriting?: boolean
  color?: string
  size?: 'small' | 'medium' | 'large'
}

interface NotebookProps {
  children: React.ReactNode
  coverColor?: 'blue' | 'red' | 'green' | 'black' | 'brown'
  spiral?: boolean
  pages?: number
  currentPage?: number
  className?: string
}

export function Paper({
  children,
  variant = 'lined',
  size = 'a4',
  margin = 'standard',
  className = '',
  animated = false
}: PaperProps) {
  const sizeClasses = {
    a4: 'aspect-[210/297] max-w-[210mm]',
    a3: 'aspect-[297/420] max-w-[297mm]',
    letter: 'aspect-[216/279] max-w-[216mm]',
    notebook: 'aspect-[140/216] max-w-[140mm]'
  }

  const marginClasses = {
    none: 'p-0',
    narrow: 'p-4',
    standard: 'p-6',
    wide: 'p-8'
  }

  const backgroundPatterns = {
    lined: 'repeating-linear-gradient(to bottom, transparent, transparent 24px, #e5e7eb 24px, #e5e7eb 25px)',
    blank: 'transparent',
    grid: 'repeating-linear-gradient(to right, #f3f4f6 1px, transparent 1px), repeating-linear-gradient(to bottom, #f3f4f6 1px, transparent 1px)',
    dotted: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
    college: 'repeating-linear-gradient(to bottom, transparent, transparent 32px, #fef3c7 32px, #fef3c7 33px)'
  }

  return (
    <motion.div
      initial={animated ? { scale: 0.95, opacity: 0 } : false}
      animate={animated ? { scale: 1, opacity: 1 } : false}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'relative bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden',
        sizeClasses[size],
        marginClasses[margin],
        className
      )}
      style={{
        backgroundImage: backgroundPatterns[variant],
        backgroundSize: variant === 'dotted' ? '8px 8px' : variant === 'grid' ? '20px 20px' : undefined,
        backgroundPosition: variant === 'grid' ? '-1px -1px' : undefined
      }}
    >
      {/* Paper texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('/paper-texture.png')] bg-repeat pointer-events-none" />
      
      {/* Shadow effect for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-900/5 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>

      {/* Paper curl effect */}
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-transparent to-gray-200/30 rounded-tl-full" />
    </motion.div>
  )
}

export function PenAnimation({ isWriting = false, color = '#1f2937', size = 'medium' }: PenAnimationProps) {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  }

  return (
    <motion.div
      className={cn('relative', sizeClasses[size])}
      animate={isWriting ? {
        rotate: [0, -5, 5, 0],
        y: [0, -2, 0]
      } : {}}
      transition={{
        duration: 0.5,
        repeat: isWriting ? Infinity : 0,
        repeatType: 'reverse'
      }}
    >
      {/* Pen body */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      
      {/* Pen tip */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
        <div 
          className="w-1 h-3"
          style={{ backgroundColor: color }}
        />
      </div>

      {/* Writing effect */}
      {isWriting && (
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.div>
  )
}

export function Notebook({
  children,
  coverColor = 'blue',
  spiral = true,
  pages = 100,
  currentPage = 1,
  className = ''
}: NotebookProps) {
  const coverColors = {
    blue: 'from-blue-600 to-blue-800',
    red: 'from-red-600 to-red-800',
    green: 'from-green-600 to-green-800',
    black: 'from-gray-800 to-gray-900',
    brown: 'from-amber-700 to-amber-900'
  }

  return (
    <motion.div
      initial={{ rotateY: -15, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn('relative preserve-3d', className)}
      style={{ perspective: '1000px' }}
    >
      {/* Notebook Cover */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br rounded-lg shadow-2xl',
        coverColors[coverColor]
      )}>
        {/* Cover texture */}
        <div className="absolute inset-0 opacity-20 bg-[url('/leather-texture.png')] bg-repeat" />
        
        {/* Spiral binding */}
        {spiral && (
          <div className="absolute left-8 top-0 bottom-0 w-4">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 bg-gray-400 rounded-full border-2 border-gray-300 mb-1"
                style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)' }}
              />
            ))}
          </div>
        )}
        
        {/* Cover title area */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-white/20 text-2xl font-bold mb-2">HANDWRITING</h2>
            <p className="text-white/10 text-sm">Premium Quality</p>
          </div>
        </div>
      </div>

      {/* Open pages */}
      <motion.div
        initial={{ rotateY: 180 }}
        animate={{ rotateY: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        className="relative bg-white rounded-lg shadow-inner"
        style={{ 
          transform: 'translateZ(1px)',
          left: spiral ? '32px' : '0',
          width: spiral ? 'calc(100% - 32px)' : '100%'
        }}
      >
        {/* Page lines */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-px bg-gray-400"
              style={{ top: `${(i + 1) * 30}px` }}
            />
          ))}
        </div>

        {/* Left margin line */}
        <div className="absolute left-12 top-0 bottom-0 w-px bg-red-400 opacity-20" />

        {/* Page content */}
        <div className="relative p-8 h-full">
          {children}
        </div>

        {/* Page number */}
        <div className="absolute bottom-4 right-4 text-gray-400 text-sm">
          {currentPage} / {pages}
        </div>

        {/* Page curl effect */}
        <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-transparent to-gray-200/30 rounded-bl-full" />
      </motion.div>
    </motion.div>
  )
}

interface WritingAnimationProps {
  text: string
  speed?: number
  color?: string
  fontSize?: number
  className?: string
}

export function WritingAnimation({ 
  text, 
  speed = 50, 
  color = '#1f2937', 
  fontSize = 16,
  className = ''
}: WritingAnimationProps) {
  return (
    <div className={cn('relative font-mono', className)} style={{ fontSize: `${fontSize}px` }}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: index * (speed / 1000), 
            duration: 0.1,
            ease: 'easeOut'
          }}
          style={{ color }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>
  )
}

interface HandwritingPreviewProps {
  sample: string
  style?: 'cursive' | 'print' | 'elegant' | 'technical'
  size?: 'small' | 'medium' | 'large'
  color?: string
  animated?: boolean
}

export function HandwritingPreview({
  sample,
  style = 'cursive',
  size = 'medium',
  color = '#1f2937',
  animated = false
}: HandwritingPreviewProps) {
  const styleClasses = {
    cursive: 'font-serif italic',
    print: 'font-mono',
    elegant: 'font-serif tracking-wide',
    technical: 'font-mono font-bold'
  }

  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  }

  return (
    <Paper variant="lined" margin="standard" className="max-w-2xl mx-auto">
      <motion.div
        initial={animated ? { opacity: 0, scale: 0.95 } : false}
        animate={animated ? { opacity: 1, scale: 1 } : false}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={cn(
          'min-h-[400px] leading-relaxed',
          styleClasses[style],
          sizeClasses[size]
        )}
        style={{ color }}
      >
        {animated ? (
          <WritingAnimation text={sample} speed={30} color={color} />
        ) : (
          sample
        )}
      </motion.div>
    </Paper>
  )
}

// Paper texture utility for global styles
export const paperStyles = `
  @keyframes paperFloat {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(1deg); }
  }

  @keyframes penStroke {
    0% { stroke-dashoffset: 100; }
    100% { stroke-dashoffset: 0; }
  }

  .preserve-3d {
    transform-style: preserve-3d;
  }

  .paper-shadow {
    box-shadow: 
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06),
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  .paper-float {
    animation: paperFloat 3s ease-in-out infinite;
  }

  .handwriting-cursor {
    display: inline-block;
    width: 2px;
    height: 1.2em;
    background: currentColor;
    animation: blink 1s infinite;
  }

  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`

export default Paper
