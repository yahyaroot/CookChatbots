'use client'

import { motion } from 'framer-motion'
import { Home, Bookmark, History, User } from 'lucide-react'

export type TabType = 'home' | 'saved' | 'history' | 'profile'

interface BottomNavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const tabs = [
  { id: 'home' as const, label: 'Home', icon: Home },
  { id: 'saved' as const, label: 'Saved', icon: Bookmark },
  { id: 'history' as const, label: 'History', icon: History },
  { id: 'profile' as const, label: 'Profile', icon: User },
]

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pb-6">
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
        className="glass-dark rounded-2xl shadow-2xl border border-border/50 mx-auto max-w-md"
      >
        <div className="flex items-center justify-around py-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                whileTap={{ scale: 0.9 }}
                className="relative flex flex-col items-center gap-1 px-4 py-2 min-w-[60px]"
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -2 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  <Icon 
                    className={`w-6 h-6 transition-colors ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  />
                </motion.div>
                
                <span className={`text-xs font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {tab.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </motion.nav>
    </div>
  )
}
