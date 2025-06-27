import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const ErrorState = ({ 
  message = "Something went wrong",
  onRetry,
  className = ''
}) => {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center text-center py-12 px-6 ${className}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="mb-6"
        animate={{ rotate: [0, -5, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <ApperIcon 
          name="AlertTriangle" 
          size={64} 
          className="text-error" 
        />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-sm">
        {message}
      </p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          icon="RefreshCw"
        >
          Try again
        </Button>
      )}
    </motion.div>
  )
}

export default ErrorState