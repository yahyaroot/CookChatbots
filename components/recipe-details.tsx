'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, ChefHat, Flame, Bookmark, Share2, Lightbulb, RefreshCw, Check } from 'lucide-react'
import type { Recipe } from '@/lib/api'
import { useRecipeStore } from '@/lib/store'
import { useState } from 'react'

interface RecipeDetailsProps {
  recipe: Recipe
  isOpen: boolean
  onClose: () => void
}

export function RecipeDetails({ recipe, isOpen, onClose }: RecipeDetailsProps) {
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

  const getDifficultyColor = (difficulty: string) => {
    const lower = difficulty.toLowerCase()
    if (lower.includes('mudah') || lower.includes('easy')) return 'bg-accent/20 text-accent'
    if (lower.includes('sedang') || lower.includes('medium')) return 'bg-yellow-500/20 text-yellow-600'
    return 'bg-red-500/20 text-red-500'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 max-h-[90vh] bg-background rounded-t-3xl overflow-hidden"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-border rounded-full" />
            </div>

            {/* Header */}
            <div className="sticky top-0 bg-background z-10 px-4 pb-4 border-b border-border">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty}
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {recipe.title}
                  </h2>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Meta info */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{recipe.duration}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary">
                  <Flame className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{recipe.calories}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary">
                  <ChefHat className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{recipe.ingredients.length} bahan</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-200px)] hide-scrollbar">
              <div className="p-4 space-y-6">
                {/* Ingredients */}
                <section>
                  <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                    <span className="text-xl">🥘</span>
                    Bahan-bahan
                  </h3>
                  <div className="bg-card rounded-2xl p-4 border border-border space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-foreground">{ingredient}</span>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Steps */}
                <section>
                  <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                    <span className="text-xl">👨‍🍳</span>
                    Langkah Memasak
                  </h3>
                  <div className="space-y-3">
                    {recipe.steps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card rounded-2xl p-4 border border-border"
                      >
                        <div className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-foreground leading-relaxed pt-1">
                            {step}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Tips */}
                {recipe.tips && recipe.tips.length > 0 && (
                  <section>
                    <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      Tips Memasak
                    </h3>
                    <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200 space-y-2">
                      {recipe.tips.map((tip, index) => (
                        <div key={index} className="flex items-start gap-2 text-yellow-800">
                          <span className="text-yellow-500 mt-1">•</span>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Alternatives */}
                {recipe.alternatives && recipe.alternatives.length > 0 && (
                  <section className="pb-24">
                    <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 text-accent" />
                      Bahan Alternatif
                    </h3>
                    <div className="bg-accent/10 rounded-2xl p-4 border border-accent/20 space-y-2">
                      {recipe.alternatives.map((alt, index) => (
                        <div key={index} className="flex items-start gap-2 text-accent">
                          <span className="mt-1">•</span>
                          <span className="text-foreground">{alt}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>

            {/* Bottom actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className={`
                    flex-1 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2
                    ${isSaved 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-foreground'
                    }
                  `}
                >
                  {justSaved ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  )}
                  {isSaved ? 'Tersimpan' : 'Simpan Resep'}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    navigator.share?.({
                      title: recipe.title,
                      text: `Check out this recipe: ${recipe.title}`,
                    })
                  }}
                  className="w-14 h-14 rounded-2xl bg-secondary text-foreground flex items-center justify-center"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
