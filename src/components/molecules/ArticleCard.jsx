import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const ArticleCard = ({ 
  article, 
  onClick,
  className = '',
  showSaveButton = false,
  onSave,
  onUnsave,
  isSaved = false,
  ...props 
}) => {
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

  const handleSaveClick = (e) => {
    e.stopPropagation()
    if (isSaved) {
      onUnsave?.(article.Id)
    } else {
      onSave?.(article.Id)
    }
  }

  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })

  return (
    <motion.div
      className={`bg-white rounded-lg shadow-card overflow-hidden cursor-pointer hover:shadow-card-hover transition-all ${className}`}
      whileHover={{ y: -2 }}
      onClick={onClick}
      {...props}
    >
      {/* Article Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={article.imageUrl}
          alt={article.headline}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop'
          }}
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={getCategoryVariant(article.category)} size="sm">
            {article.category}
          </Badge>
        </div>

        {/* Save Button */}
        {showSaveButton && (
          <motion.button
            onClick={handleSaveClick}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
              isSaved 
                ? 'bg-secondary text-white shadow-lg' 
                : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ApperIcon 
              name={isSaved ? 'Bookmark' : 'BookmarkPlus'} 
              size={18} 
            />
          </motion.button>
        )}
      </div>

      {/* Article Content */}
      <div className="p-4">
        {/* Source and Time */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span className="font-medium">{article.source}</span>
          <div className="flex items-center gap-1">
            <ApperIcon name="Clock" size={14} />
            <span>{timeAgo}</span>
          </div>
        </div>

        {/* Headline */}
        <h3 className="font-display font-semibold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight">
          {article.headline}
        </h3>

        {/* Summary */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-3 leading-relaxed">
          {article.summary}
        </p>

        {/* Reading Time */}
        <div className="flex items-center text-xs text-gray-500">
          <ApperIcon name="BookOpen" size={12} className="mr-1" />
          <span>{article.readingTime} min read</span>
        </div>
      </div>
    </motion.div>
  )
}

export default ArticleCard