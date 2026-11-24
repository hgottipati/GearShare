/**
 * Ski Program Session Dates Configuration
 * 
 * Update these dates whenever you need to change session start dates.
 * Format: YYYY-MM-DD (e.g., '2027-01-10')
 * 
 * Set to null if a session is not scheduled.
 */

export const skiProgramConfig = {
  session1: {
    startDate: '2027-01-10', // January 10, 2027
    enrollmentDeadline: '2026-12-28', // December 28, 2026 - Last day to enroll
    name: 'Session 1',
    classDates: [
      '2027-01-10', // 1st class: January 10, 2027
      '2027-01-17', // 2nd class: January 17, 2027
      '2027-01-24', // 3rd class: January 24, 2027
      '2027-01-30', // 4th class: January 30, 2027
    ] as string[],
  },
  session2: {
    startDate: null as string | null, // Set date when scheduled, e.g., '2027-02-14'
    enrollmentDeadline: null as string | null, // Set deadline when session is scheduled
    name: 'Session 2',
    classDates: [] as string[], // Will be populated when session is scheduled
  },
}

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
 * Helper function to format date in shorter format (e.g., "Saturday, January 24, 2026")
 */
export function formatClassDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00')
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
