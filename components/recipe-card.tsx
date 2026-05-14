'use client'

import { motion } from 'framer-motion'
import { Clock, ChefHat, Flame, Bookmark, Share2, Check } from 'lucide-react'
import type { Recipe } from '@/lib/api'
import { useRecipeStore } from '@/lib/store'
import { useState } from 'react'

interface RecipeCardProps {
  recipe: Recipe
  onViewDetails?: () => void
}

export function RecipeCard({ recipe, onViewDetails }: RecipeCardProps) {
  const { saveRecipe, unsaveRecipe, savedRecipes } = useRecipeStore()
  const [justSaved, setJustSaved] = useState(false)
  
  const isSaved = savedRecipes.some(r => r.title === recipe.title)

  const handleSave = () => {
    if (isSaved) {
      const saved = savedRecipes.find(r => r.title === recipe.title)
      if (saved) unsaveRecipe(saved.id)
    } else {
      saveRecipe(recipe)
      setJustSaved(true)
      setTimeout(() => setJustSaved(false), 1500)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: recipe.title,
        text: `Check out this recipe: ${recipe.title}`,
      })
    } catch {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`${recipe.title}\n\nIngredients:\n${recipe.ingredients.join('\n')}`)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    const lower = difficulty.toLowerCase()
    if (lower.includes('mudah') || lower.includes('easy')) return 'bg-accent/20 text-accent'
    if (lower.includes('sedang') || lower.includes('medium')) return 'bg-yellow-500/20 text-yellow-600'
    return 'bg-red-500/20 text-red-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-card rounded-3xl shadow-xl overflow-hidden border border-border/50"
    >
      {/* Food image placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-orange-200 flex items-center justify-center">
        <div className="text-6xl">🍽️</div>
        
        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSave}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center
              transition-all duration-300
              ${isSaved 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-white/90 text-foreground hover:bg-white'
              }
            `}
          >
            {justSaved ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                <Check className="w-5 h-5" />
              </motion.div>
            ) : (
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            )}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-white/90 text-foreground flex items-center justify-center hover:bg-white transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Difficulty badge */}
        <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold ${getDifficultyColor(recipe.difficulty)}`}>
          {recipe.difficulty}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
          {recipe.title}
        </h3>

        {/* Meta info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{recipe.duration}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Flame className="w-4 h-4" />
            <span className="text-sm">{recipe.calories}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <ChefHat className="w-4 h-4" />
            <span className="text-sm">{recipe.ingredients.length} bahan</span>
          </div>
        </div>

        {/* View details button */}
        <motion.button
          onClick={onViewDetails}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl bg-secondary text-foreground font-semibold hover:bg-secondary/80 transition-colors"
        >
          Lihat Resep Lengkap
        </motion.button>
      </div>
    </motion.div>
  )
}
