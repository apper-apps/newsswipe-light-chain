import { motion } from 'framer-motion'
import ArticleCard from '@/components/molecules/ArticleCard'
import SkeletonCard from '@/components/molecules/SkeletonCard'

const ArticleGrid = ({ 
  articles, 
  loading = false, 
  onArticleClick,
  onSave,
  onUnsave,
  savedArticleIds = new Set(),
  className = '' 
}) => {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {[...Array(6)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  }

  return (
    <motion.div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {articles.map((article) => (
        <motion.div key={article.Id} variants={itemVariants}>
          <ArticleCard
            article={article}
            onClick={() => onArticleClick?.(article)}
            showSaveButton={true}
            isSaved={savedArticleIds.has(article.Id)}
            onSave={onSave}
            onUnsave={onUnsave}
            className="h-full"
          />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default ArticleGrid