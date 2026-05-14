'use client'

import { motion } from 'framer-motion'
import { Trash2, Clock, ChefHat } from 'lucide-react'
import { useRecipeStore } from '@/lib/store'
import { EmptyState } from './empty-state'
import type { Recipe } from '@/lib/api'

interface SavedRecipesProps {
  onViewRecipe: (recipe: Recipe) => void
}

export function SavedRecipes({ onViewRecipe }: SavedRecipesProps) {
  const { savedRecipes, unsaveRecipe } = useRecipeStore()

  if (savedRecipes.length === 0) {
    return <EmptyState type="no-saved" />
  }

  return (
    <div className="px-4 pb-32">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Resep Tersimpan</h2>
        <p className="text-muted-foreground">{savedRecipes.length} resep favorit</p>
      </div>

      <div className="space-y-4">
        {savedRecipes.map((recipe, index) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card rounded-2xl p-4 shadow-lg border border-border/50"
          >
            <div className="flex gap-4">
              {/* Thumbnail */}
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/20 to-orange-200 flex items-center justify-center shrink-0">
                <span className="text-3xl">🍽️</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate mb-1">
                  {recipe.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {recipe.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <ChefHat className="w-3.5 h-3.5" />
                    {recipe.ingredients.length} bahan
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onViewRecipe(recipe)}
                    className="text-sm font-medium text-primary"
                  >
                    Lihat Resep
                  </motion.button>
                </div>
              </div>

              {/* Delete button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => unsaveRecipe(recipe.id)}
                className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0 self-start"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
