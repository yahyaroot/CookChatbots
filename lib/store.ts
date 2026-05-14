import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Recipe } from './api'

interface RecipeWithId extends Recipe {
  id: string
  createdAt: string
  imageUrl?: string
}

interface RecipeStore {
  savedRecipes: RecipeWithId[]
  history: RecipeWithId[]
  currentRecipe: Recipe | null
  isLoading: boolean
  loadingText: string
  
  setCurrentRecipe: (recipe: Recipe | null) => void
  setIsLoading: (loading: boolean) => void
  setLoadingText: (text: string) => void
  saveRecipe: (recipe: Recipe) => void
  unsaveRecipe: (id: string) => void
  addToHistory: (recipe: Recipe) => void
  clearHistory: () => void
  isSaved: (title: string) => boolean
}

export const useRecipeStore = create<RecipeStore>()(
  persist(
    (set, get) => ({
      savedRecipes: [],
      history: [],
      currentRecipe: null,
      isLoading: false,
      loadingText: '',

      setCurrentRecipe: (recipe) => set({ currentRecipe: recipe }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setLoadingText: (text) => set({ loadingText: text }),

      saveRecipe: (recipe) => {
        const newRecipe: RecipeWithId = {
          ...recipe,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          savedRecipes: [newRecipe, ...state.savedRecipes],
        }))
      },

      unsaveRecipe: (id) => {
        set((state) => ({
          savedRecipes: state.savedRecipes.filter((r) => r.id !== id),
        }))
      },

      addToHistory: (recipe) => {
        const newRecipe: RecipeWithId = {
          ...recipe,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          history: [newRecipe, ...state.history].slice(0, 50),
        }))
      },

      clearHistory: () => set({ history: [] }),

      isSaved: (title) => {
        return get().savedRecipes.some((r) => r.title === title)
      },
    }),
    {
      name: 'cookchatbots-storage',
    }
  )
)
