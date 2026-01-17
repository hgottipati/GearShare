'use client'

import { Snowflake, Calendar } from 'lucide-react'

export default function SeasonStatus() {
  const getSeasonStatus = () => {
    const now = new Date()
    const month = now.getMonth() + 1 // 1-12
    const day = now.getDate()

    // Typical ski season: November - April
    // Adjust these dates based on your actual season
    const seasonStart = { month: 11, day: 15 } // November 15
    const seasonEnd = { month: 4, day: 30 } // April 30

    const isInSeason = 
      (month > seasonStart.month || (month === seasonStart.month && day >= seasonStart.day)) ||
      (month < seasonEnd.month || (month === seasonEnd.month && day <= seasonEnd.day))

    if (isInSeason) {
      const year = now.getFullYear()
      const seasonYear = month >= seasonStart.month ? `${year}-${year + 1}` : `${year - 1}-${year}`
      return {
        status: 'open',
        message: `${seasonYear} Season Now Open`,
        color: 'bg-green-50 border-green-200 text-green-800',
        iconColor: 'text-green-600',
      }
    } else {
      // Calculate days until season starts
      const seasonStartDate = new Date(now.getFullYear(), seasonStart.month - 1, seasonStart.day)
      if (seasonStartDate < now) {
        seasonStartDate.setFullYear(seasonStartDate.getFullYear() + 1)
      }
      const daysUntil = Math.ceil((seasonStartDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      
      return {
        status: 'closed',
        message: `Season Opens in ${daysUntil} Days`,
        color: 'bg-blue-50 border-blue-200 text-blue-800',
        iconColor: 'text-blue-600',
      }
    }
  }

  const seasonInfo = getSeasonStatus()

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${seasonInfo.color}`}>
      <Snowflake className={`w-4 h-4 ${seasonInfo.iconColor}`} />
      <span className="text-sm font-medium">{seasonInfo.message}</span>
    </div>
  )
}



