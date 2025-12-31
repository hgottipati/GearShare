/**
 * Ski Program Session Dates Configuration
 * 
 * Update these dates whenever you need to change session start dates.
 * Format: YYYY-MM-DD (e.g., '2025-01-24')
 * 
 * Set to null if a session is not scheduled.
 */

export const skiProgramConfig = {
  session1: {
    startDate: '2025-01-24', // January 24, 2025 (Saturday)
    name: 'Session 1',
  },
  session2: {
    startDate: null as string | null, // Set date when scheduled, e.g., '2025-02-15'
    name: 'Session 2',
  },
} as const

/**
 * Helper function to format date for display
 */
export function formatSessionDate(dateString: string | null): string {
  if (!dateString) return ''
  
  const date = new Date(dateString + 'T00:00:00') // Add time to avoid timezone issues
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  
  return date.toLocaleDateString('en-US', options)
}

/**
 * Helper function to get the next upcoming session
 */
export function getNextSession() {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  
  const sessions = [
    { ...skiProgramConfig.session1, number: 1, startDate: skiProgramConfig.session1.startDate },
    { ...skiProgramConfig.session2, number: 2, startDate: skiProgramConfig.session2.startDate },
  ]
    .filter(session => session.startDate !== null)
    .map(session => ({
      ...session,
      date: new Date(session.startDate! + 'T00:00:00'),
    }))
    .filter(session => session.date >= now)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
  
  return sessions[0] || null
}

/**
 * Check if a session date is upcoming (in the future)
 */
export function isSessionUpcoming(dateString: string | null): boolean {
  if (!dateString) return false
  
  const sessionDate = new Date(dateString + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return sessionDate >= today
}

