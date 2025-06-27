import { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const PullToRefresh = ({ 
  onRefresh, 
  children, 
  threshold = 80,
  className = '' 
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isPulling, setIsPulling] = useState(false)
  const containerRef = useRef(null)
  const y = useMotionValue(0)
  const pullProgress = useTransform(y, [0, threshold], [0, 1])

  const handlePanStart = () => {
    const container = containerRef.current
    if (container && container.scrollTop === 0) {
      setIsPulling(true)
    }
  }

  const handlePanEnd = async () => {
    if (isPulling && y.get() >= threshold && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onRefresh?.()
      } finally {
        setIsRefreshing(false)
        setIsPulling(false)
        y.set(0)
      }
    } else {
      setIsPulling(false)
      y.set(0)
    }
  }

  useEffect(() => {
    if (isRefreshing) {
      y.set(threshold)
    }
  }, [isRefreshing, threshold, y])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Pull indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center py-4"
        style={{
          y: useTransform(y, [0, threshold], [-60, 0]),
          opacity: useTransform(y, [0, threshold * 0.5, threshold], [0, 0.5, 1])
        }}
      >
        <div className="flex items-center gap-2 text-secondary">
          <motion.div
            animate={isRefreshing ? { rotate: 360 } : {}}
            transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
          >
            <ApperIcon 
              name={isRefreshing ? "Loader2" : "RotateCcw"} 
              size={20}
              className={isRefreshing ? "animate-spin" : ""}
            />
          </motion.div>
          <span className="text-sm font-medium">
            {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
          </span>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        ref={containerRef}
        className="h-full overflow-y-auto scrollbar-thin"
        style={{ y }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.3, bottom: 0 }}
        onDragStart={handlePanStart}
        onDragEnd={handlePanEnd}
        dragDirectionLock
      >
        <div className="min-h-full">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

export default PullToRefresh