'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus } from 'lucide-react'

const QUICK_INGREDIENTS = [
  { id: 'telur', label: 'Telur', icon: '🥚' },
  { id: 'mie', label: 'Mie', icon: '🍜' },
  { id: 'ayam', label: 'Ayam', icon: '🍗' },
  { id: 'nasi', label: 'Nasi', icon: '🍚' },
  { id: 'keju', label: 'Keju', icon: '🧀' },
  { id: 'cabai', label: 'Cabai', icon: '🌶️' },
]

interface IngredientInputProps {
  value: string
  onChange: (value: string) => void
  selectedChips: string[]
  onChipToggle: (chip: string) => void
}

export function IngredientInput({ 
  value, 
  onChange, 
  selectedChips, 
  onChipToggle 
}: IngredientInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="space-y-4">
      {/* Text Input */}
      <div className="relative">
        <motion.div
          animate={{
            boxShadow: isFocused 
              ? '0 0 0 3px rgba(255, 122, 0, 0.2)' 
              : '0 0 0 0px rgba(255, 122, 0, 0)',
          }}
          className="relative rounded-2xl overflow-hidden"
        >
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Contoh: telur, mie, cabai, bawang"
            rows={3}
            className="
              w-full px-4 py-4 
              bg-secondary/50 border-2 border-border
              rounded-2xl resize-none
              text-foreground placeholder:text-muted-foreground
              focus:outline-none focus:border-primary
              transition-colors duration-200
              text-base
            "
          />
        </motion.div>
      </div>

      {/* Quick Ingredient Chips */}
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-3">
          Pilih cepat:
        </p>
        <div className="flex flex-wrap gap-2">
          {QUICK_INGREDIENTS.map((ingredient, index) => {
            const isSelected = selectedChips.includes(ingredient.id)
            
            return (
              <motion.button
                key={ingredient.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onChipToggle(ingredient.id)}
                className={`
                  relative flex items-center gap-2 px-4 py-2.5
                  rounded-full font-medium text-sm
                  transition-all duration-200
                  ${isSelected 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
                    : 'bg-card border border-border text-foreground hover:border-primary/50'
                  }
                `}
              >
                <span className="text-base">{ingredient.icon}</span>
                <span>{ingredient.label}</span>
                <AnimatePresence>
                  {isSelected && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="ml-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </motion.span>
                  )}
                </AnimatePresence>
                {!isSelected && (
                  <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Selected ingredients summary */}
      <AnimatePresence>
        {selectedChips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-accent/10 rounded-xl p-3 border border-accent/20"
          >
            <p className="text-sm text-accent font-medium">
              {selectedChips.length} bahan dipilih: {selectedChips.map(id => 
                QUICK_INGREDIENTS.find(i => i.id === id)?.label
              ).join(', ')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
