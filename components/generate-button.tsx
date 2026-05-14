'use client'

import { motion } from 'framer-motion'
import { Sparkles, Loader2 } from 'lucide-react'

interface GenerateButtonProps {
  onClick: () => void
  isLoading: boolean
  disabled?: boolean
}

export function GenerateButton({ onClick, isLoading, disabled }: GenerateButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        relative w-full py-4 px-6
        rounded-2xl font-semibold text-lg
        flex items-center justify-center gap-3
        transition-all duration-300
        ${disabled || isLoading
          ? 'bg-muted text-muted-foreground cursor-not-allowed'
          : 'bg-gradient-to-r from-primary to-orange-500 text-primary-foreground shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40'
        }
      `}
    >
      {/* Glow effect */}
      {!disabled && !isLoading && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary to-orange-500 blur-xl opacity-50"
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
      
      <span className="relative flex items-center gap-3">
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            <span>Generate Resep AI</span>
          </>
        )}
      </span>
    </motion.button>
  )
}
