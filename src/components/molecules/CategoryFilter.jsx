import { motion } from 'framer-motion'
import Badge from '@/components/atoms/Badge'

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  className = '' 
}) => {
  const allCategories = ['All', ...categories]

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

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {allCategories.map((category, index) => (
        <motion.button
          key={category}
          onClick={() => onCategoryChange(category)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Badge
            variant={selectedCategory === category ? 'primary' : getCategoryVariant(category)}
            size="sm"
            className={`cursor-pointer transition-all ${
              selectedCategory === category 
                ? 'ring-2 ring-secondary ring-opacity-50' 
                : 'hover:shadow-sm'
            }`}
          >
            {category}
          </Badge>
        </motion.button>
      ))}
    </div>
  )
}

export default CategoryFilter