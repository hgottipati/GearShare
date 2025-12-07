'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Cloud, CloudSnow, Sun, Wind, Calendar, X, CloudRain, CloudDrizzle, CloudLightning } from 'lucide-react'

interface WeatherData {
  name: string
  fullName: string
  temp: number
  condition: string
  icon: string
  forecast?: ForecastDay[]
}

interface ForecastDay {
  date: string
  high: number
  low: number
  condition: string
  icon: string
}

interface WeatherWidgetProps {
  resorts: Array<{
    name: string
    fullName: string
    lat: number
    lon: number
  }>
}

export default function WeatherWidget({ resorts }: WeatherWidgetProps) {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [clickedIndex, setClickedIndex] = useState<number | null>(null)
  const [popupPosition, setPopupPosition] = useState<{ [key: number]: 'above' | 'below' }>({})
  const cardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})

  const checkPopupPosition = useCallback((index: number) => {
    const cardElement = cardRefs.current[index]
    if (!cardElement) return

    const rect = cardElement.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const spaceBelow = viewportHeight - rect.bottom
    const spaceAbove = rect.top
    const popupHeight = 400 // Approximate height of the popup

    // If not enough space below but enough space above, show above
    if (spaceBelow < popupHeight && spaceAbove > popupHeight) {
      setPopupPosition((prev) => ({ ...prev, [index]: 'above' }))
    } else {
      setPopupPosition((prev) => ({ ...prev, [index]: 'below' }))
    }
  }, [])

  useEffect(() => {
    loadWeather()
    // Refresh every 30 minutes
    const interval = setInterval(loadWeather, 30 * 60 * 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resorts])

  useEffect(() => {
    // Update popup positions on scroll
    const handleScroll = () => {
      if (hoveredIndex !== null || clickedIndex !== null) {
        const activeIndex = hoveredIndex !== null ? hoveredIndex : clickedIndex
        if (activeIndex !== null) {
          checkPopupPosition(activeIndex)
        }
      }
    }

    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleScroll)
    }
  }, [hoveredIndex, clickedIndex, checkPopupPosition])

  const loadWeather = async () => {
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY
    if (!apiKey) {
      console.error('Weather API key not configured')
      setError('Weather API key not configured')
      setLoading(false)
      return
    }

    try {
      const weatherPromises = resorts.map(async (resort) => {
        // Get current weather
        const currentResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${resort.lat}&lon=${resort.lon}&units=imperial&appid=${apiKey}`
        )
        if (!currentResponse.ok) {
          const errorData = await currentResponse.json().catch(() => ({}))
          console.error(`Weather API error for ${resort.name}:`, currentResponse.status, errorData)
          throw new Error(`Weather API error: ${currentResponse.status}`)
        }
        const currentData = await currentResponse.json()

        // Get 5-day forecast
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${resort.lat}&lon=${resort.lon}&units=imperial&appid=${apiKey}`
        )
        let forecast: ForecastDay[] = []
        
        if (forecastResponse.ok) {
          const forecastData = await forecastResponse.json()
          // Group by day and get high/low for each day
          const dailyForecasts: { [key: string]: any[] } = {}
          
          forecastData.list.forEach((item: any) => {
            const date = new Date(item.dt * 1000)
            const dateKey = date.toDateString()
            if (!dailyForecasts[dateKey]) {
              dailyForecasts[dateKey] = []
            }
            dailyForecasts[dateKey].push(item)
          })

          // Get next 5 days
          forecast = Object.keys(dailyForecasts)
            .slice(0, 5)
            .map((dateKey) => {
              const dayData = dailyForecasts[dateKey]
              const temps = dayData.map((d: any) => d.main.temp)
              const high = Math.round(Math.max(...temps))
              const low = Math.round(Math.min(...temps))
              const mostCommonCondition = dayData[Math.floor(dayData.length / 2)]
              
              return {
                date: dateKey,
                high,
                low,
                condition: mostCommonCondition.weather[0].main,
                icon: mostCommonCondition.weather[0].icon,
              }
            })
        }

        return {
          name: resort.name,
          fullName: resort.fullName,
          temp: Math.round(currentData.main.temp),
          condition: currentData.weather[0].main,
          icon: currentData.weather[0].icon,
          forecast,
        }
      })

      const results = await Promise.all(weatherPromises)
      console.log('Weather data loaded:', results)
      setWeatherData(results)
      setError(null)
    } catch (err) {
      console.error('Error loading weather:', err)
      setError(err instanceof Error ? err.message : 'Unable to load weather')
      setWeatherData([])
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (condition: string, iconCode?: string) => {
    const lower = condition.toLowerCase()
    
    // Use OpenWeatherMap icon codes for more accurate icons
    // Icon codes: 01=clear, 02=few clouds, 03=scattered, 04=broken, 09=shower, 10=rain, 11=thunder, 13=snow, 50=mist
    if (iconCode) {
      const iconNum = iconCode.substring(0, 2)
      if (iconNum === '01') return <Sun className="w-5 h-5 text-yellow-500" />
      if (iconNum === '02' || iconNum === '03' || iconNum === '04') return <Cloud className="w-5 h-5" />
      if (iconNum === '09' || iconNum === '10') return <CloudRain className="w-5 h-5 text-blue-500" />
      if (iconNum === '11') return <CloudLightning className="w-5 h-5 text-purple-500" />
      if (iconNum === '13') return <CloudSnow className="w-5 h-5 text-blue-300" />
      if (iconNum === '50') return <Cloud className="w-5 h-5 text-gray-400" />
    }
    
    // Fallback to condition text parsing
    if (lower.includes('snow')) return <CloudSnow className="w-5 h-5 text-blue-300" />
    if (lower.includes('rain') || lower.includes('drizzle') || lower.includes('shower')) {
      return <CloudRain className="w-5 h-5 text-blue-500" />
    }
    if (lower.includes('thunder') || lower.includes('storm')) {
      return <CloudLightning className="w-5 h-5 text-purple-500" />
    }
    if (lower.includes('cloud') || lower.includes('overcast')) return <Cloud className="w-5 h-5" />
    if (lower.includes('wind')) return <Wind className="w-5 h-5" />
    if (lower.includes('mist') || lower.includes('fog') || lower.includes('haze')) {
      return <Cloud className="w-5 h-5 text-gray-400" />
    }
    return <Sun className="w-5 h-5 text-yellow-500" />
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
    
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  if (loading) {
    return (
      <div className="flex gap-4 justify-center">
        {resorts.map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-100 rounded-lg p-3 w-24 h-20"></div>
        ))}
      </div>
    )
  }

  if (error) {
    // Show error message in development, silently fail in production
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className="text-center text-sm text-gray-500 p-4">
          Weather unavailable: {error}
        </div>
      )
    }
    return null
  }

  if (weatherData.length === 0 && !loading) {
    return null // Silently fail if no data
  }

  const showForecast = (index: number) => {
    return hoveredIndex === index || clickedIndex === index
  }

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index)
    checkPopupPosition(index)
  }

  const toggleForecast = (index: number) => {
    if (clickedIndex === index) {
      setClickedIndex(null)
    } else {
      setClickedIndex(index)
      // Check position when opening
      setTimeout(() => checkPopupPosition(index), 10)
    }
  }

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {weatherData.map((weather, index) => {
        const position = popupPosition[index] || 'below'
        const isAbove = position === 'above'
        
        return (
        <div
          key={index}
          className="relative"
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div 
            ref={(el) => {
              cardRefs.current[index] = el
            }}
            className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => toggleForecast(index)}
          >
            <div className="text-xs font-semibold text-gray-700 mb-1">{weather.name}</div>
            <div className="flex items-center gap-2">
              {getWeatherIcon(weather.condition, weather.icon)}
              <div className="text-lg font-bold text-gray-900">{weather.temp}°F</div>
            </div>
            <div className="text-xs text-gray-500 mt-1">{weather.condition}</div>
          </div>

          {/* Forecast Tooltip/Popover */}
          {showForecast(index) && weather.forecast && weather.forecast.length > 0 && (
            <div 
              className={`absolute z-50 left-1/2 transform -translate-x-1/2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 md:block ${
                isAbove 
                  ? 'bottom-full mb-2' 
                  : 'top-full mt-2'
              }`}
              style={{
                maxHeight: 'calc(100vh - 2rem)',
                overflowY: 'auto',
              }}
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{weather.fullName}</h3>
                  <p className="text-sm text-gray-600">5-Day Forecast</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setClickedIndex(null)
                  }}
                  className="md:hidden text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close forecast"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                {weather.forecast.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-sm font-medium text-gray-700 w-24">
                        {formatDate(day.date)}
                      </div>
                      <div className="flex items-center gap-2">
                        {getWeatherIcon(day.condition, day.icon)}
                        <span className="text-xs text-gray-600">{day.condition}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{day.high}°</span>
                      <span className="text-sm text-gray-500">/</span>
                      <span className="text-sm text-gray-500">{day.low}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        )
      })}
    </div>
  )
}
