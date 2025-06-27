import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'

const ArticleModal = ({ article, isOpen, onClose, onSave, onReadMore }) => {
  if (!article) return null

  const getCategoryVariant = (category) => {
    const variants = {
      'World': 'world',
      'Technology': 'technology',
      'Business': 'business',
      'Sports': 'sports',
      'Health': 'health',
      'Science': 'science'
    }
    return variants[category] || 'default'
  }

  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleSave = () => {
    onSave?.(article.Id)
    onClose()
  }

  const handleReadMore = () => {
    onReadMore?.(article.url)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-t-3xl sm:rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
              initial={{ y: '100%', scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: '100%', scale: 0.95 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Badge variant={getCategoryVariant(article.category)} size="sm">
                    {article.category}
                  </Badge>
                  <span className="text-sm text-gray-500 font-medium">
                    {article.source}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ApperIcon name="X" size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto scrollbar-thin max-h-[calc(90vh-8rem)]">
                {/* Image */}
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.headline}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop'
                    }}
                  />
                </div>

                {/* Article Details */}
                <div className="p-6">
                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Clock" size={14} />
                      <span>{timeAgo}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ApperIcon name="BookOpen" size={14} />
                      <span>{article.readingTime} min read</span>
                    </div>
                  </div>

                  {/* Headline */}
                  <h1 className="font-display font-bold text-2xl text-gray-900 mb-4 leading-tight">
                    {article.headline}
                  </h1>

                  {/* Summary */}
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {article.summary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    icon="Bookmark"
                    onClick={handleSave}
                  >
                    Save Article
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1"
                    icon="ExternalLink"
                    onClick={handleReadMore}
                  >
                    Read Full Story
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ArticleModal