'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void
  selectedImage: File | null
}

export function ImageUpload({ onImageSelect, selectedImage }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    if (file.type.startsWith('image/')) {
      onImageSelect(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }, [onImageSelect])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  const clearImage = useCallback(() => {
    onImageSelect(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [onImageSelect, previewUrl])

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleInputChange}
        className="hidden"
        id="image-upload"
      />

      <AnimatePresence mode="wait">
        {previewUrl && selectedImage ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-2xl overflow-hidden"
          >
            <div className="relative aspect-video w-full">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={clearImage}
              className="absolute top-3 right-3 w-8 h-8 bg-foreground/80 text-background rounded-full flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </motion.button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/60 to-transparent p-4">
              <p className="text-white text-sm font-medium truncate">
                {selectedImage.name}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.label
            key="upload"
            htmlFor="image-upload"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`
              relative flex flex-col items-center justify-center
              aspect-video w-full rounded-2xl cursor-pointer
              border-2 border-dashed transition-all duration-300
              ${isDragging 
                ? 'border-primary bg-primary/10 scale-[1.02]' 
                : 'border-border bg-secondary/50 hover:border-primary/50 hover:bg-secondary'
              }
            `}
          >
            <motion.div
              animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="relative">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center"
                  whileHover={{ rotate: 5 }}
                >
                  <ImageIcon className="w-8 h-8 text-primary" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-accent flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Camera className="w-4 h-4 text-accent-foreground" />
                </motion.div>
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">
                  Upload Foto Kulkas
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Tap untuk foto atau drag & drop
                </p>
              </div>
            </motion.div>

            {/* Upload icon in corner */}
            <div className="absolute top-3 right-3">
              <Upload className="w-5 h-5 text-muted-foreground" />
            </div>
          </motion.label>
        )}
      </AnimatePresence>
    </div>
  )
}
