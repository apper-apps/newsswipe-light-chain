import articlesData from '@/services/mockData/articles.json'
import { delay } from '@/utils/delay'

// Mock storage for persistent data
let articles = [...articlesData]
let savedArticleIds = new Set()
let swipedArticleIds = new Set()

const articleService = {
  async getAll() {
    await delay(300)
    return [...articles]
  },

  async getById(id) {
    await delay(200)
    const article = articles.find(article => article.Id === parseInt(id, 10))
    if (!article) {
      throw new Error('Article not found')
    }
    return { ...article }
  },

  async getFeedArticles(excludeIds = []) {
    await delay(300)
    const excludeSet = new Set([...excludeIds, ...swipedArticleIds])
    const feedArticles = articles.filter(article => !excludeSet.has(article.Id))
    return [...feedArticles]
  },

  async getSavedArticles() {
    await delay(250)
    const savedArticles = articles.filter(article => savedArticleIds.has(article.Id))
    return [...savedArticles]
  },

  async saveArticle(id) {
    await delay(150)
    const articleId = parseInt(id, 10)
    if (!articles.find(article => article.Id === articleId)) {
      throw new Error('Article not found')
    }
    savedArticleIds.add(articleId)
    return true
  },

  async unsaveArticle(id) {
    await delay(150)
    const articleId = parseInt(id, 10)
    savedArticleIds.delete(articleId)
    return true
  },

  async markAsSwipedLeft(id) {
    await delay(100)
    const articleId = parseInt(id, 10)
    swipedArticleIds.add(articleId)
    return true
  },

  async refreshFeed() {
    await delay(500)
    // Simulate new articles by clearing swiped history
    swipedArticleIds.clear()
    return [...articles]
  },

  async searchSavedArticles(query) {
    await delay(200)
    const savedArticles = articles.filter(article => savedArticleIds.has(article.Id))
    if (!query) return [...savedArticles]
    
    const searchTerm = query.toLowerCase()
    const filtered = savedArticles.filter(article =>
      article.headline.toLowerCase().includes(searchTerm) ||
      article.summary.toLowerCase().includes(searchTerm) ||
      article.source.toLowerCase().includes(searchTerm) ||
      article.category.toLowerCase().includes(searchTerm)
    )
    return [...filtered]
  },

  async filterSavedByCategory(category) {
    await delay(200)
    const savedArticles = articles.filter(article => savedArticleIds.has(article.Id))
    if (!category || category === 'All') return [...savedArticles]
    
    const filtered = savedArticles.filter(article => article.category === category)
    return [...filtered]
  }
}

export default articleService