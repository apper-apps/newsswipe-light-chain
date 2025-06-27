import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ArticleGrid from '@/components/organisms/ArticleGrid'
import ArticleModal from '@/components/organisms/ArticleModal'
import SearchBar from '@/components/molecules/SearchBar'
import CategoryFilter from '@/components/molecules/CategoryFilter'
import EmptyState from '@/components/molecules/EmptyState'
import ErrorState from '@/components/molecules/ErrorState'
import articleService from '@/services/api/articleService'

const Saved = () => {
  const [savedArticles, setSavedArticles] = useState([])
  const [filteredArticles, setFilteredArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [availableCategories, setAvailableCategories] = useState([])
  const [savedArticleIds, setSavedArticleIds] = useState(new Set())

  const loadSavedArticles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const articles = await articleService.getSavedArticles()
      setSavedArticles(articles)
      setFilteredArticles(articles)
      
      // Extract unique categories
      const categories = [...new Set(articles.map(article => article.category))]
      setAvailableCategories(categories)
      
      // Create set of saved article IDs
      const ids = new Set(articles.map(article => article.Id))
      setSavedArticleIds(ids)
    } catch (err) {
      setError(err.message || 'Failed to load saved articles')
      toast.error('Failed to load saved articles')
    } finally {
      setLoading(false)
    }
  }, [])

  const filterArticles = useCallback(() => {
    let filtered = [...savedArticles]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(article =>
        article.headline.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.source.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query)
      )
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(article => article.category === selectedCategory)
    }

    setFilteredArticles(filtered)
  }, [savedArticles, searchQuery, selectedCategory])

  const handleSearch = useCallback((query) => {
    setSearchQuery(query)
  }, [])

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category)
  }, [])

  const handleArticleClick = useCallback((article) => {
    setSelectedArticle(article)
    setIsModalOpen(true)
  }, [])

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false)
    setSelectedArticle(null)
  }, [])

  const handleUnsave = async (articleId) => {
    try {
      await articleService.unsaveArticle(articleId)
      setSavedArticles(prev => prev.filter(article => article.Id !== articleId))
      setSavedArticleIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(articleId)
        return newSet
      })
      toast.success('Article removed from saved')
    } catch (err) {
      toast.error('Failed to remove article')
    }
  }

  const handleSave = async (articleId) => {
    try {
      await articleService.saveArticle(articleId)
      setSavedArticleIds(prev => new Set([...prev, articleId]))
      toast.success('Article saved!')
    } catch (err) {
      toast.error('Failed to save article')
    }
  }

  const handleReadMore = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
    handleModalClose()
  }

  useEffect(() => {
    loadSavedArticles()
  }, [loadSavedArticles])

  useEffect(() => {
    filterArticles()
  }, [filterArticles])

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  if (loading) {
    return (
      <motion.div
        className="h-full bg-gray-50"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="h-full overflow-y-auto scrollbar-thin">
          <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
              <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
            <ArticleGrid loading={true} />
          </div>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        className="h-full bg-gray-50"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <ErrorState
          message={error}
          onRetry={loadSavedArticles}
          className="h-full"
        />
      </motion.div>
    )
  }

  if (savedArticles.length === 0) {
    return (
      <motion.div
        className="h-full bg-gray-50"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <EmptyState
          icon="Bookmark"
          title="No saved articles"
          description="Start saving articles from your feed to build your personal reading list"
          className="h-full"
        />
      </motion.div>
    )
  }

  return (
    <motion.div
      className="h-full bg-gray-50"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="h-full overflow-y-auto scrollbar-thin">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <motion.div
            className="mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-display font-bold text-gray-900">
                  Saved Articles
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {savedArticles.length} articles in your reading list
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-secondary">
                  {filteredArticles.length}
                </div>
                <div className="text-xs text-gray-500">
                  {filteredArticles.length === savedArticles.length ? 'total' : 'filtered'}
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search saved articles..."
              />
              
              {availableCategories.length > 0 && (
                <CategoryFilter
                  categories={availableCategories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                />
              )}
            </div>
          </motion.div>

          {/* Articles Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {filteredArticles.length === 0 ? (
              <EmptyState
                icon="Search"
                title="No articles match your filters"
                description="Try adjusting your search or category filters to find more articles"
                className="py-12"
              />
            ) : (
              <ArticleGrid
                articles={filteredArticles}
                onArticleClick={handleArticleClick}
                onSave={handleSave}
                onUnsave={handleUnsave}
                savedArticleIds={savedArticleIds}
                className="mb-8"
              />
            )}
          </motion.div>
        </div>
      </div>

      {/* Article Modal */}
      <ArticleModal
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
        onReadMore={handleReadMore}
      />
    </motion.div>
  )
}

export default Saved