import { motion } from 'framer-motion'

const SkeletonCard = ({ className = '' }) => {
  return (
    <motion.div
      className={`bg-white rounded-lg shadow-card overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Skeleton */}
      <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Source and Time */}
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
        
        {/* Headline */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>
        
        {/* Summary */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>
        
        {/* Reading Time */}
        <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
      </div>
    </motion.div>
  )
}

export default SkeletonCard