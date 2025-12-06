'use client'

import { useEffect, useState, useRef } from 'react'
import { Twitter, ExternalLink } from 'lucide-react'

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: () => void
      }
    }
  }
}

interface TwitterFeedProps {
  accounts: Array<{
    username: string
    displayName: string
    url: string
  }>
}

export default function TwitterFeed({ accounts }: TwitterFeedProps) {
  const [widgetsLoaded, setWidgetsLoaded] = useState(false)
  const widgetsLoadedRef = useRef(false)

  useEffect(() => {
    // Load Twitter widgets script
    if (!widgetsLoadedRef.current) {
      const script = document.createElement('script')
      script.src = 'https://platform.twitter.com/widgets.js'
      script.async = true
      script.charset = 'utf-8'
      script.onload = () => {
        setWidgetsLoaded(true)
        widgetsLoadedRef.current = true
        // Force widget rendering
        if (window.twttr && window.twttr.widgets) {
          window.twttr.widgets.load()
        }
      }
      document.body.appendChild(script)

      return () => {
        const existingScript = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]')
        if (existingScript) {
          document.body.removeChild(existingScript)
        }
      }
    }
  }, [])

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
          <Twitter className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">Traffic & Conditions</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Real-Time Updates
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Stay informed about road conditions and resort updates from official sources
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {accounts.map((account, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Twitter className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{account.displayName}</h3>
                    <p className="text-sm text-gray-500">@{account.username}</p>
                  </div>
                </div>
                <a
                  href={account.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>

              {/* Twitter Timeline Embed */}
              <div className="border-t border-gray-200 pt-4">
                <div className="bg-gray-50 rounded-lg p-4 min-h-[400px]">
                  <a
                    className="twitter-timeline"
                    data-height="400"
                    data-theme="light"
                    data-chrome="noheader,nofooter"
                    href={`https://twitter.com/${account.username}?ref_src=twsrc%5Etfw`}
                  >
                    Loading tweets from @{account.username}...
                  </a>
                  {!widgetsLoaded && (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Twitter className="w-12 h-12 text-gray-400 mx-auto mb-3 animate-pulse" />
                        <p className="text-gray-600 mb-4">
                          Loading Twitter feed...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>For real-time updates, follow these accounts on Twitter</p>
      </div>
    </div>
  )
}

