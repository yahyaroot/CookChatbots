'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning'

interface ToastNotificationProps {
  type: ToastType
  message: string
  isVisible: boolean
  onClose: () => void
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgClass: 'bg-accent',
    iconColor: 'text-white',
  },
  error: {
    icon: XCircle,
    bgClass: 'bg-destructive',
    iconColor: 'text-white',
  },
  warning: {
    icon: AlertCircle,
    bgClass: 'bg-yellow-500',
    iconColor: 'text-white',
  },
}

export function ToastNotification({ type, message, isVisible, onClose }: ToastNotificationProps) {
  const config = toastConfig[type]
  const Icon = config.icon

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          className="fixed top-4 left-4 right-4 z-50 flex justify-center"
        >
          <div className={`${config.bgClass} rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3 max-w-sm`}>
            <Icon className={`w-5 h-5 ${config.iconColor} shrink-0`} />
            <p className="text-white font-medium text-sm flex-1">{message}</p>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0"
            >
              <X className="w-4 h-4 text-white" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
