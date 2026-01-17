'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from '@/app/providers'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'
import { validateListingForm, type ValidationErrors } from '@/components/FormValidation'

export default function CreateListingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Skis',
    condition: 'Good',
    size: '',
    price: '',
    location: '',
    trade_only: false,
    open_to_trade: false,
    trade_wants: '',
    rent_available: false,
    rent_price: '',
    status: 'Available',
  })

  const [images, setImages] = useState<File[]>([])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to create a listing.</p>
      </div>
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5)
      setImages(files)
    }
  }

  const uploadImages = async (listingId: string) => {
    if (images.length === 0) return

    for (let i = 0; i < images.length; i++) {
      const file = images[i]
      const fileExt = file.name.split('.').pop()
      const fileName = `${listingId}/${Date.now()}-${i}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(fileName, file)

      if (uploadError) {
        console.error('Error uploading image:', uploadError)
        continue
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('listing-images').getPublicUrl(fileName)

      await supabase.from('listing_images').insert({
        listing_id: listingId,
        image_url: publicUrl,
        image_order: i,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setValidationErrors({})

    // Validate form
    const errors = validateListingForm(formData)
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      setLoading(false)
      toast.error('Please fix the form errors')
      return
    }

    try {
      // Create listing
      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description || null,
          category: formData.category,
          condition: formData.condition,
          size: formData.size || null,
          price: formData.price ? parseFloat(formData.price) : null,
          location: formData.location || null,
          trade_only: formData.trade_only,
          open_to_trade: formData.open_to_trade,
          trade_wants: formData.trade_wants || null,
          rent_available: formData.rent_available,
          rent_price: formData.rent_price ? parseFloat(formData.rent_price) : null,
        })
        .select()
        .single()

      if (listingError) throw listingError

      // Upload images
      if (images.length > 0 && listing) {
        await uploadImages(listing.id)
      }

      toast.success('Listing created!')
      router.push(`/listings/${listing.id}`)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      toast.error(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-8">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Listing</h1>
          <p className="text-gray-600">Share your gear with the community</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Listing</h1>
          <p className="text-gray-600">Share your gear with the community</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value })
                if (validationErrors.title) {
                  setValidationErrors({ ...validationErrors, title: '' })
                }
              }}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                validationErrors.title
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {validationErrors.title && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value })
                if (validationErrors.description) {
                  setValidationErrors({ ...validationErrors, description: '' })
                }
              }}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                validationErrors.description
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {validationErrors.description && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Skis">Skis</option>
                <option value="Boots">Boots</option>
                <option value="Poles">Poles</option>
                <option value="Helmets">Helmets</option>
                <option value="Clothing">Clothing</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition *
              </label>
              <select
                value={formData.condition}
                onChange={(e) =>
                  setFormData({ ...formData, condition: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="New">New</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Used">Used</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size (e.g., 90cm, size 5)
              </label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location (e.g., Bothell, Seattle)
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Bothell / Seattle area"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => {
                setFormData({ ...formData, price: e.target.value })
                if (validationErrors.price) {
                  setValidationErrors({ ...validationErrors, price: '' })
                }
              }}
              disabled={formData.trade_only}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 disabled:bg-gray-100 ${
                validationErrors.price
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {validationErrors.price && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.price}</p>
            )}
          </div>

          <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-2">Listing Options</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.trade_only}
                  onChange={(e) =>
                    setFormData({ ...formData, trade_only: e.target.checked })
                  }
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Trade Only (no price)
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.open_to_trade}
                  onChange={(e) =>
                    setFormData({ ...formData, open_to_trade: e.target.checked })
                  }
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Open to Trade
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.rent_available}
                  onChange={(e) =>
                    setFormData({ ...formData, rent_available: e.target.checked })
                  }
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Available for Rent
                </span>
              </label>
            </div>

            {formData.rent_available && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rent Price per Season ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.rent_price}
                  onChange={(e) =>
                    setFormData({ ...formData, rent_price: e.target.value })
                  }
                  placeholder="e.g., 200.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {formData.open_to_trade && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What are you looking for in trade?
              </label>
              <textarea
                value={formData.trade_wants}
                onChange={(e) =>
                  setFormData({ ...formData, trade_wants: e.target.value })
                }
                rows={2}
                placeholder="e.g., Looking for 100cm skis or size 6 boots"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos (1-5 images)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {images.length > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                {images.length} image(s) selected
              </p>
            )}
          </div>

          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3.5 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors shadow-sm"
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

