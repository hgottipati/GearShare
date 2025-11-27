'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageGalleryProps {
  images: { image_url: string; image_order: number }[]
  title: string
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const sortedImages = [...images].sort((a, b) => a.image_order - b.image_order)

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = 'unset'
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % sortedImages.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowRight') nextImage()
    if (e.key === 'ArrowLeft') prevImage()
  }

  if (sortedImages.length === 0) {
    return (
      <div className="aspect-video bg-gray-200 flex items-center justify-center">
        <p className="text-gray-400">No images</p>
      </div>
    )
  }

  return (
    <>
      {/* Thumbnail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {sortedImages.map((img, idx) => (
          <div
            key={idx}
            className="aspect-video relative bg-gray-200 rounded overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => openLightbox(idx)}
          >
            <Image
              src={img.image_url}
              alt={`${title} - Image ${idx + 1}`}
              fill
              className="object-cover rounded"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {sortedImages.length > 1 && (
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {idx + 1}/{sortedImages.length}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            aria-label="Close"
          >
            <X size={32} />
          </button>

          {sortedImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-4 text-white hover:text-gray-300 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft size={40} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-4 text-white hover:text-gray-300 z-10"
                aria-label="Next image"
              >
                <ChevronRight size={40} />
              </button>
            </>
          )}

          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={sortedImages[currentIndex].image_url}
              alt={`${title} - Image ${currentIndex + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
              priority
            />
          </div>

          {sortedImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {currentIndex + 1} / {sortedImages.length}
            </div>
          )}
        </div>
      )}
    </>
  )
}

