import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const SwipeIndicator = ({ direction, opacity = 0 }) => {
  const isLeft = direction === 'left'
  const isRight = direction === 'right'

  if (opacity === 0) return null

  return (
    <motion.div
      className={`absolute inset-0 flex items-center justify-center pointer-events-none z-10 ${
        isLeft ? 'bg-gray-900/20' : 'bg-secondary/20'
      }`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: opacity, scale: 1 }}
      style={{ opacity }}
    >
      <motion.div
        className={`px-6 py-3 rounded-xl font-bold text-2xl tracking-wider border-4 ${
          isLeft 
            ? 'text-gray-700 border-gray-700 bg-white/90' 
            : 'text-secondary border-secondary bg-white/90'
        }`}
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: isLeft ? -12 : 12
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <ApperIcon 
            name={isLeft ? 'X' : 'Heart'} 
            size={32} 
            className={isLeft ? 'text-gray-700' : 'text-secondary'}
          />
          <span>{isLeft ? 'SKIP' : 'SAVE'}</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SwipeIndicator