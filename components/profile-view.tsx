'use client'

import { motion } from 'framer-motion'
import { User, Bookmark, History, ChefHat, Sparkles, Settings, HelpCircle, Star } from 'lucide-react'
import { useRecipeStore } from '@/lib/store'

export function ProfileView() {
  const { savedRecipes, history } = useRecipeStore()

  const stats = [
    { label: 'Resep Tersimpan', value: savedRecipes.length, icon: Bookmark, color: 'text-primary' },
    { label: 'Resep Dibuat', value: history.length, icon: History, color: 'text-accent' },
  ]

  const menuItems = [
    { label: 'Pengaturan', icon: Settings },
    { label: 'Bantuan', icon: HelpCircle },
    { label: 'Beri Rating', icon: Star },
  ]

  return (
    <div className="px-4 pb-32">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center pt-8 pb-6"
      >
        <div className="relative mb-4">
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <User className="w-10 h-10 text-white" />
          </motion.div>
          <motion.div
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChefHat className="w-4 h-4 text-white" />
          </motion.div>
        </div>
        <h2 className="text-xl font-bold text-foreground">Chef User</h2>
        <p className="text-muted-foreground text-sm">Food Explorer</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl p-4 border border-border/50 text-center"
            >
              <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${stat.color} bg-current/10`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          )
        })}
      </div>

      {/* AI powered badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-primary/10 to-orange-400/10 rounded-2xl p-4 border border-primary/20 mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI-Powered Recipes</h3>
            <p className="text-sm text-muted-foreground">Dapatkan resep terbaik dari AI</p>
          </div>
        </div>
      </motion.div>

      {/* Menu items */}
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="font-medium text-foreground">{item.label}</span>
            </motion.button>
          )
        })}
      </div>

      {/* App info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-8"
      >
        <p className="text-sm text-muted-foreground">CookChatbots v1.0</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Powered by AI</p>
      </motion.div>
    </div>
  )
}
