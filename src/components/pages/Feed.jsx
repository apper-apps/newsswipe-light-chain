import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import SwipeableStack from '@/components/organisms/SwipeableStack'
import ArticleModal from '@/components/organisms/ArticleModal'
import PullToRefresh from '@/components/organisms/PullToRefresh'
import EmptyState from '@/components/molecules/EmptyState'
import ErrorState from '@/components/molecules/ErrorState'
import articleService from '@/services/api/articleService'

const Feed = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const loadFeedArticles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const feedArticles = await articleService.getFeedArticles()
      setArticles(feedArticles)
    } catch (err) {
      setError(err.message || 'Failed to load articles')
      toast.error('Failed to load articles')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleRefresh = async () => {
    try {
      const refreshedArticles = await articleService.refreshFeed()
      setArticles(refreshedArticles)
      toast.success('Feed refreshed!')
    } catch (err) {
      toast.error('Failed to refresh feed')
    }
  }

  const handleSwipeLeft = useCallback((articleId) => {
    // Remove article from current stack
    setArticles(prev => prev.filter(article => article.Id !== articleId))
  }, [])

  const handleSwipeRight = useCallback((articleId) => {
    // Remove article from current stack
    setArticles(prev => prev.filter(article => article.Id !== articleId))
  }, [])

  const handleCardTap = useCallback((article) => {
    setSelectedArticle(article)
    setIsModalOpen(true)
  }, [])

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false)
    setSelectedArticle(null)
  }, [])

  const handleSaveFromModal = async (articleId) => {
    try {
      await articleService.saveArticle(articleId)
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
    loadFeedArticles()
  }, [loadFeedArticles])

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  if (loading) {
    return (
      <motion.div
        className="h-full flex items-center justify-center bg-gray-50"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full" />
          </motion.div>
          <p className="text-gray-600 font-medium">Loading fresh news...</p>
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
          onRetry={loadFeedArticles}
          className="h-full"
        />
      </motion.div>
    )
  }

  if (articles.length === 0) {
    return (
      <motion.div
        className="h-full bg-gray-50"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <PullToRefresh onRefresh={handleRefresh} className="h-full">
          <EmptyState
            icon="Newspaper"
            title="No articles available"
            description="Pull down to refresh and discover new stories"
            className="h-full"
          />
        </PullToRefresh>
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
      <PullToRefresh onRefresh={handleRefresh} className="h-full">
        <div className="h-full">
          {/* Header */}
          <motion.div
            className="flex-shrink-0 px-6 py-4 bg-white border-b border-gray-200"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-display font-bold text-gray-900">
                  NewsSwipe
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Swipe right to save, left to skip
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-secondary">
                  {articles.length}
                </div>
                <div className="text-xs text-gray-500">
                  articles left
                </div>
              </div>
            </div>
          </motion.div>

          {/* Swipeable Stack */}
          <motion.div
            className="flex-1 overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <SwipeableStack
              articles={articles}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              onCardTap={handleCardTap}
              className="h-full"
            />
          </motion.div>
        </div>
      </PullToRefresh>

      {/* Article Modal */}
      <ArticleModal
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveFromModal}
        onReadMore={handleReadMore}
      />
    </motion.div>
  )
}

export default Feed