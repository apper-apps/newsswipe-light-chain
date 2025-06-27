import { delay } from '@/utils/delay'

// Mock storage for user preferences
let userPreferences = {
  categories: ['World', 'Technology', 'Business', 'Sports', 'Health'],
  savedArticles: [],
  swipedArticles: []
}

const preferencesService = {
  async getPreferences() {
    await delay(200)
    return { ...userPreferences }
  },

  async updateCategories(categories) {
    await delay(250)
    userPreferences.categories = [...categories]
    return { ...userPreferences }
  },

  async toggleCategory(category) {
    await delay(150)
    const categories = [...userPreferences.categories]
    const index = categories.indexOf(category)
    
    if (index > -1) {
      categories.splice(index, 1)
    } else {
      categories.push(category)
    }
    
    userPreferences.categories = categories
    return { ...userPreferences }
  },

  async getAvailableCategories() {
    await delay(100)
    return ['World', 'Technology', 'Business', 'Sports', 'Health', 'Science', 'Entertainment', 'Politics']
  }
}

export default preferencesService