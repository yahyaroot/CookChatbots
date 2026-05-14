'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HeroSection } from '@/components/hero-section'
import { ImageUpload } from '@/components/image-upload'
import { IngredientInput } from '@/components/ingredient-input'
import { GenerateButton } from '@/components/generate-button'
import { LoadingState } from '@/components/loading-state'
import { RecipeCard } from '@/components/recipe-card'
import { RecipeDetails } from '@/components/recipe-details'
import { BottomNavigation, type TabType } from '@/components/bottom-navigation'
import { EmptyState } from '@/components/empty-state'
import { SavedRecipes } from '@/components/saved-recipes'
import { HistoryView } from '@/components/history-view'
import { ProfileView } from '@/components/profile-view'
import { ToastNotification, type ToastType } from '@/components/toast-notification'
import { generateFromText, generateFromImage, type Recipe } from '@/lib/api'
import { useRecipeStore } from '@/lib/store'

// Mock data for demo purposes when API is unavailable
const mockRecipe: Recipe = {
  title: 'Mie Goreng Spesial dengan Telur dan Sayuran',
  duration: '15-20 menit',
  difficulty: 'Mudah',
  calories: '450 kkal',
  ingredients: [
    '2 bungkus mie instan',
    '2 butir telur',
    '3 siung bawang putih, cincang',
    '2 batang daun bawang, iris',
    '2 sdm kecap manis',
    '1 sdm saus tiram',
    'Cabai rawit sesuai selera',
    'Garam dan merica secukupnya',
    'Minyak goreng',
  ],
  steps: [
    'Rebus mie hingga setengah matang, tiriskan dan sisihkan. Jangan terlalu lembek agar hasil akhir tidak lembek.',
    'Panaskan minyak di wajan dengan api sedang. Tumis bawang putih hingga harum dan kecokelatan.',
    'Masukkan telur, orak-arik hingga matang. Pisahkan ke pinggir wajan.',
    'Masukkan mie yang sudah direbus, aduk rata dengan telur orak-arik.',
    'Tambahkan kecap manis, saus tiram, garam, dan merica. Aduk rata hingga bumbu meresap.',
    'Masukkan cabai rawit dan daun bawang, aduk sebentar. Angkat dan sajikan selagi hangat.',
  ],
  tips: [
    'Gunakan api besar saat menumis mie agar hasilnya tidak lembek',
    'Tambahkan sayuran seperti sawi atau kol untuk nutrisi lebih',
    'Sajikan dengan kerupuk dan acar untuk pelengkap',
  ],
  alternatives: [
    'Mie instan bisa diganti dengan mie telur atau mie kuning',
    'Saus tiram bisa diganti dengan kecap ikan',
    'Tambahkan udang atau ayam suwir untuk protein ekstra',
  ],
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [ingredientText, setIngredientText] = useState('')
  const [selectedChips, setSelectedChips] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedRecipeForDetails, setSelectedRecipeForDetails] = useState<Recipe | null>(null)
  const [toast, setToast] = useState<{ type: ToastType; message: string; visible: boolean }>({
    type: 'success',
    message: '',
    visible: false,
  })

  const { addToHistory } = useRecipeStore()

  const showToast = useCallback((type: ToastType, message: string) => {
    setToast({ type, message, visible: true })
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000)
  }, [])

  const handleChipToggle = useCallback((chipId: string) => {
    setSelectedChips(prev => 
      prev.includes(chipId) 
        ? prev.filter(id => id !== chipId)
        : [...prev, chipId]
    )
  }, [])

  const handleGenerate = useCallback(async () => {
    const hasImage = selectedImage !== null
    const hasText = ingredientText.trim().length > 0
    const hasChips = selectedChips.length > 0

    if (!hasImage && !hasText && !hasChips) {
      showToast('warning', 'Pilih bahan atau upload foto terlebih dahulu')
      return
    }

    setIsLoading(true)
    setCurrentRecipe(null)

    try {
      let result

      if (hasImage) {
        result = await generateFromImage(selectedImage)
      } else {
        const prompt = [ingredientText, ...selectedChips].filter(Boolean).join(', ')
        result = await generateFromText(prompt)
      }

      if (result.success && result.data) {
        setCurrentRecipe(result.data)
        addToHistory(result.data)
        showToast('success', 'Resep berhasil dibuat!')
      } else {
        // Use mock data for demo when API fails
        setCurrentRecipe(mockRecipe)
        addToHistory(mockRecipe)
        showToast('success', 'Resep berhasil dibuat! (Demo mode)')
      }
    } catch {
      // Use mock data for demo
      setCurrentRecipe(mockRecipe)
      addToHistory(mockRecipe)
      showToast('success', 'Resep berhasil dibuat! (Demo mode)')
    } finally {
      setIsLoading(false)
    }
  }, [selectedImage, ingredientText, selectedChips, addToHistory, showToast])

  const handleViewRecipeDetails = useCallback((recipe: Recipe) => {
    setSelectedRecipeForDetails(recipe)
    setShowDetails(true)
  }, [])

  // Reset state when switching tabs
  useEffect(() => {
    if (activeTab !== 'home') {
      setShowDetails(false)
    }
  }, [activeTab])

  const canGenerate = selectedImage !== null || ingredientText.trim().length > 0 || selectedChips.length > 0

  return (
    <main className="min-h-screen pb-24 relative">
      {/* Toast notifications */}
      <ToastNotification
        type={toast.type}
        message={toast.message}
        isVisible={toast.visible}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />

      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <HeroSection />

            {/* Main content */}
            <div className="px-4 space-y-6">
              {/* Input card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card rounded-3xl p-5 shadow-xl border border-border/50"
              >
                <div className="space-y-6">
                  {/* Image upload */}
                  <ImageUpload
                    selectedImage={selectedImage}
                    onImageSelect={setSelectedImage}
                  />

                  {/* Divider */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-sm text-muted-foreground font-medium">atau</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {/* Ingredient input */}
                  <IngredientInput
                    value={ingredientText}
                    onChange={setIngredientText}
                    selectedChips={selectedChips}
                    onChipToggle={handleChipToggle}
                  />
                </div>
              </motion.div>

              {/* Generate button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GenerateButton
                  onClick={handleGenerate}
                  isLoading={isLoading}
                  disabled={!canGenerate}
                />
              </motion.div>

              {/* Loading state */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <LoadingState />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Recipe result */}
              <AnimatePresence>
                {currentRecipe && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="pb-8"
                  >
                    <h2 className="text-lg font-bold text-foreground mb-4">
                      Resep untuk Kamu
                    </h2>
                    <RecipeCard
                      recipe={currentRecipe}
                      onViewDetails={() => handleViewRecipeDetails(currentRecipe)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Empty state when no recipe yet */}
              {!currentRecipe && !isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <EmptyState type="no-recipes" />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'saved' && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="pt-8"
          >
            <SavedRecipes onViewRecipe={handleViewRecipeDetails} />
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="pt-8"
          >
            <HistoryView onViewRecipe={handleViewRecipeDetails} />
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <ProfileView />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Recipe details modal */}
      {selectedRecipeForDetails && (
        <RecipeDetails
          recipe={selectedRecipeForDetails}
          isOpen={showDetails}
          onClose={() => {
            setShowDetails(false)
            setSelectedRecipeForDetails(null)
          }}
        />
      )}
    </main>
  )
}
