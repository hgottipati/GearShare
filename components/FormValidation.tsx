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

