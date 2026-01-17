'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from '@/app/providers'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'

export default function EditListingPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

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
  const [existingImages, setExistingImages] = useState<
    { id: string; image_url: string; image_order: number }[]
  >([])

  useEffect(() => {
    if (params.id && user) {
      loadListing()
    }
  }, [params.id, user])

  const loadListing = async () => {
    if (!user) return

    const { data: listing, error } = await supabase
      .from('listings')
      .select(
        `
        *,
        listing_images(id, image_url, image_order)
      `
      )
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (error || !listing) {
      toast.error('Listing not found or you do not have permission to edit it')
      router.push('/')
      return
    }

    setFormData({
      title: listing.title,
      description: listing.description || '',
      category: listing.category,
      condition: listing.condition,
      size: listing.size || '',
      price: listing.price ? listing.price.toString() : '',
      location: (listing as any).location || '',
      trade_only: listing.trade_only,
      open_to_trade: listing.open_to_trade,
      trade_wants: listing.trade_wants || '',
      rent_available: (listing as any).rent_available || false,
      rent_price: (listing as any).rent_price ? (listing as any).rent_price.toString() : '',
      status: 'Available', // Will be set from database after migration
    })

    if (listing.listing_images) {
      setExistingImages(
        listing.listing_images.sort(
          (a: { image_order: number }, b: { image_order: number }) =>
            a.image_order - b.image_order
        )
      )
    }

    setLoadingData(false)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5)
      setImages(files)
    }
  }

  const deleteExistingImage = async (imageId: string) => {
    const { error } = await supabase
      .from('listing_images')
      .delete()
      .eq('id', imageId)

    if (error) {
      toast.error('Error deleting image')
    } else {
      setExistingImages(existingImages.filter((img) => img.id !== imageId))
      toast.success('Image deleted')
    }
  }

  const uploadImages = async (listingId: string) => {
    if (images.length === 0) return

    const startOrder = existingImages.length

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
        image_order: startOrder + i,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !params.id) return

    setLoading(true)

    try {
      // Update listing
      const { error: listingError } = await supabase
        .from('listings')
        .update({
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
        .eq('id', params.id)
        .eq('user_id', user.id)

      if (listingError) throw listingError

      // Upload new images
      if (images.length > 0) {
        await uploadImages(params.id as string)
      }

      toast.success('Listing updated!')
      router.push(`/listings/${params.id}`)
    } catch (err: any) {
      toast.error(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16 md:pb-8">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to edit a listing.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Listing</h1>
          <p className="text-gray-600">Update your listing details</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              disabled={formData.trade_only}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
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

          {/* Status field - only show after migration is run */}
          {/* 
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
              <option value="Traded">Traded</option>
            </select>
          </div>
          */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Existing Photos
            </label>
            {existingImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 mb-4">
                {existingImages.map((img) => (
                  <div key={img.id} className="relative">
                    <img
                      src={img.image_url}
                      alt="Listing"
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => deleteExistingImage(img.id)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-4">No existing images</p>
            )}

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add More Photos (1-5 images)
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
                {images.length} new image(s) selected
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="pt-6 border-t border-gray-200 flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors border border-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors shadow-sm"
              >
                {loading ? 'Updating...' : 'Update Listing'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

