'use client'

import { motion } from 'framer-motion'
import { Trash2, Clock, ChefHat } from 'lucide-react'
import { useRecipeStore } from '@/lib/store'
import { EmptyState } from './empty-state'
import type { Recipe } from '@/lib/api'

interface HistoryViewProps {
  onViewRecipe: (recipe: Recipe) => void
}

export function HistoryView({ onViewRecipe }: HistoryViewProps) {
  const { history, clearHistory } = useRecipeStore()

  if (history.length === 0) {
    return <EmptyState type="no-history" />
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="px-4 pb-32">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Riwayat Resep</h2>
          <p className="text-muted-foreground">{history.length} resep dibuat</p>
        </div>
        {history.length > 0 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={clearHistory}
            className="px-4 py-2 rounded-xl bg-destructive/10 text-destructive text-sm font-medium flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Hapus Semua
          </motion.button>
        )}
      </div>

      <div className="space-y-4">
        {history.map((recipe, index) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onViewRecipe(recipe)}
            className="bg-card rounded-2xl p-4 shadow-lg border border-border/50 cursor-pointer hover:shadow-xl transition-shadow"
          >
            <div className="flex gap-4">
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-orange-200 flex items-center justify-center shrink-0">
                <span className="text-2xl">🍽️</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate mb-1">
                  {recipe.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {recipe.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <ChefHat className="w-3.5 h-3.5" />
                    {recipe.ingredients.length} bahan
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(recipe.createdAt)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
