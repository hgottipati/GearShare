// Form validation utilities

export interface ValidationErrors {
  [key: string]: string
}

export function validateListingForm(formData: {
  title: string
  description: string
  category: string
  condition: string
  price: string
  trade_only: boolean
}): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!formData.title.trim()) {
    errors.title = 'Title is required'
  } else if (formData.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters'
  } else if (formData.title.trim().length > 100) {
    errors.title = 'Title must be less than 100 characters'
  }

  if (formData.description && formData.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters'
  }

  if (!formData.category) {
    errors.category = 'Category is required'
  }

  if (!formData.condition) {
    errors.condition = 'Condition is required'
  }

  if (!formData.trade_only) {
    if (formData.price) {
      const priceNum = parseFloat(formData.price)
      if (isNaN(priceNum) || priceNum < 0) {
        errors.price = 'Price must be a valid positive number'
      } else if (priceNum > 100000) {
        errors.price = 'Price seems too high. Please verify.'
      }
    }
  }

  return errors
}

export function validateProfileForm(formData: {
  name: string
  phone: string
}): ValidationErrors {
  const errors: ValidationErrors = {}

  if (formData.name && formData.name.trim().length > 100) {
    errors.name = 'Name must be less than 100 characters'
  }

  if (formData.phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    if (!phoneRegex.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number'
    }
    if (formData.phone.replace(/\D/g, '').length < 10) {
      errors.phone = 'Phone number must have at least 10 digits'
    }
  }

  return errors
}

export function validateMessageForm(message: string): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!message.trim()) {
    errors.message = 'Message is required'
  } else if (message.trim().length < 5) {
    errors.message = 'Message must be at least 5 characters'
  } else if (message.trim().length > 500) {
    errors.message = 'Message must be less than 500 characters'
  }

  return errors
}

export function validateSkiLessonForm(formData: {
  email: string
  parent_name: string
  participant_name: string
  age: string
  phone_number: string
  ski_level: string
  lesson_type: string
  questions_preferences?: string
  gear_status: string
}): ValidationErrors {
  const errors: ValidationErrors = {}

  // Email validation
  if (!formData.email.trim()) {
    errors.email = 'Email is required'
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
  }

  // Parent name validation
  if (!formData.parent_name.trim()) {
    errors.parent_name = 'Parent/Guardian name is required'
  } else if (formData.parent_name.trim().length > 100) {
    errors.parent_name = 'Name must be less than 100 characters'
  }

  // Participant name validation
  if (!formData.participant_name.trim()) {
    errors.participant_name = "Participant's name is required"
  } else if (formData.participant_name.trim().length > 100) {
    errors.participant_name = 'Name must be less than 100 characters'
  }

  // Age validation
  if (!formData.age.trim()) {
    errors.age = 'Age is required'
  } else {
    const ageNum = parseInt(formData.age)
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 100) {
      errors.age = 'Please enter a valid age (1-100)'
    } else if (ageNum < 6 || ageNum > 15) {
      errors.age = 'Age must be between 6 and 15'
    }
  }

  // Phone validation
  if (!formData.phone_number.trim()) {
    errors.phone_number = 'Phone number is required'
  } else {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    if (!phoneRegex.test(formData.phone_number)) {
      errors.phone_number = 'Please enter a valid phone number'
    }
    const digitsOnly = formData.phone_number.replace(/\D/g, '')
    if (digitsOnly.length < 10) {
      errors.phone_number = 'Phone number must have at least 10 digits'
    }
  }

  // Ski level validation
  if (!formData.ski_level) {
    errors.ski_level = 'Ski level is required'
  } else if (!['Beginner', 'Intermediate', 'Advanced'].includes(formData.ski_level)) {
    errors.ski_level = 'Please select a valid ski level'
  }

  // Lesson type validation
  if (!formData.lesson_type) {
    errors.lesson_type = 'Lesson type is required'
  } else if (
    !['4-week-private', '4-week-group', 'one-time-private', 'one-time-group'].includes(
      formData.lesson_type
    )
  ) {
    errors.lesson_type = 'Please select a valid lesson type'
  }

  // Questions/preferences validation (optional)
  if (formData.questions_preferences && formData.questions_preferences.length > 1000) {
    errors.questions_preferences = 'Questions/preferences must be less than 1000 characters'
  }

  // Gear status validation
  if (!formData.gear_status) {
    errors.gear_status = 'Gear status is required'
  } else if (!['ready', 'need-help'].includes(formData.gear_status)) {
    errors.gear_status = 'Please select a gear status'
  }

  return errors
}

