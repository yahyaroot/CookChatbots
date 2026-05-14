'use client'

import { motion } from 'framer-motion'
import { UtensilsCrossed, Bookmark, History, AlertCircle, ImageOff } from 'lucide-react'
import type { ReactNode } from 'react'

type EmptyStateType = 'no-recipes' | 'no-saved' | 'no-history' | 'error' | 'upload-failed'

interface EmptyStateProps {
  type: EmptyStateType
  message?: string
  action?: ReactNode
}

const stateConfig = {
  'no-recipes': {
    icon: UtensilsCrossed,
    emoji: '🍳',
    title: 'Belum Ada Resep',
    description: 'Upload foto kulkas atau ketik bahan makananmu untuk mendapatkan resep dari AI.',
    gradient: 'from-primary/20 to-orange-200/40',
  },
  'no-saved': {
    icon: Bookmark,
    emoji: '📚',
    title: 'Belum Ada Resep Tersimpan',
    description: 'Resep yang kamu simpan akan muncul di sini. Mulai jelajahi dan simpan resep favoritmu!',
    gradient: 'from-accent/20 to-green-200/40',
  },
  'no-history': {
    icon: History,
    emoji: '⏰',
    title: 'Belum Ada Riwayat',
    description: 'Resep yang pernah kamu buat akan tersimpan di sini untuk referensi nanti.',
    gradient: 'from-blue-500/20 to-cyan-200/40',
  },
  'error': {
    icon: AlertCircle,
    emoji: '😔',
    title: 'Terjadi Kesalahan',
    description: 'Maaf, terjadi kesalahan saat memproses permintaanmu. Silakan coba lagi.',
    gradient: 'from-destructive/20 to-red-200/40',
  },
  'upload-failed': {
    icon: ImageOff,
    emoji: '📷',
    title: 'Upload Gagal',
    description: 'Gambar tidak dapat diproses. Pastikan gambar valid dan coba lagi.',
    gradient: 'from-yellow-500/20 to-amber-200/40',
  },
}

export function EmptyState({ type, message, action }: EmptyStateProps) {
  const config = stateConfig[type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      {/* Animated background */}
      <div className="relative mb-6">
        <motion.div
          className={`absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-br ${config.gradient} blur-2xl`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="relative w-24 h-24 rounded-3xl bg-card border border-border flex items-center justify-center shadow-lg"
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <span className="text-4xl">{config.emoji}</span>
        </motion.div>
      </div>

      <h3 className="text-xl font-bold text-foreground mb-2">
        {config.title}
      </h3>
      
      <p className="text-muted-foreground max-w-xs leading-relaxed">
        {message || config.description}
      </p>

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  )
}
