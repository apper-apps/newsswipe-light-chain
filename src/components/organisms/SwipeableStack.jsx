import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { toast } from "react-toastify";
import ArticleCard from "@/components/molecules/ArticleCard";
import SwipeIndicator from "@/components/molecules/SwipeIndicator";
import EmptyState from "@/components/molecules/EmptyState";
import articleService from "@/services/api/articleService";

const SwipeableStack = ({ articles, onSwipeLeft, onSwipeRight, onCardTap, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const cardRefs = useRef([])

  // Motion values for the current card
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 0.5, 1, 0.5, 0])

  // Swipe indicator opacity
  const leftOpacity = useTransform(x, [-200, -50, 0], [1, 0.5, 0])
  const rightOpacity = useTransform(x, [0, 50, 200], [0, 0.5, 1])

const currentArticle = articles[currentIndex]
  const remainingCards = articles.length - currentIndex

  const handleDragEnd = async (event, info) => {
    const threshold = 100
    const velocity = info.velocity.x

    if (Math.abs(info.offset.x) > threshold || Math.abs(velocity) > 500) {
      // Determine swipe direction
      const isSwipeLeft = info.offset.x < 0 || velocity < -500
      
      if (isSwipeLeft) {
        // Swipe left - skip article
        setIsLoading(true)
        try {
          await articleService.markAsSwipedLeft(currentArticle.Id)
          onSwipeLeft?.(currentArticle.Id)
          setCurrentIndex(prev => prev + 1)
        } catch (error) {
          toast.error('Failed to skip article')
        } finally {
          setIsLoading(false)
        }
      } else {
        // Swipe right - save article
        setIsLoading(true)
        try {
          await articleService.saveArticle(currentArticle.Id)
          onSwipeRight?.(currentArticle.Id)
          toast.success('Article saved!')
          setCurrentIndex(prev => prev + 1)
        } catch (error) {
          toast.error('Failed to save article')
        } finally {
          setIsLoading(false)
        }
      }
      
      // Reset position for next card
      x.set(0)
      y.set(0)
    } else {
      // Snap back to center
      x.set(0)
      y.set(0)
    }
  }

  const handleCardTap = () => {
    if (currentArticle && !isLoading) {
      onCardTap?.(currentArticle)
    }
  }

  // Reset index when articles change
  useEffect(() => {
    setCurrentIndex(0)
    x.set(0)
    y.set(0)
  }, [articles, x, y])

  if (!articles || articles.length === 0) {
    return (
      <div className={className}>
        <EmptyState
          icon="Newspaper"
          title="No more articles"
          description="Pull down to refresh and discover new stories"
          className="h-full"
        />
      </div>
    )
  }

  if (currentIndex >= articles.length) {
    return (
      <div className={className}>
        <EmptyState
          icon="CheckCircle"
          title="All caught up!"
          description="You've gone through all available articles. Pull down to refresh for more news."
          className="h-full"
        />
      </div>
    )
  }

  return (
    <div className={`relative h-full ${className}`}>
      {/* Stack of cards */}
      <div className="relative h-full">
        {/* Background cards */}
        {articles.slice(currentIndex + 1, currentIndex + 3).map((article, index) => (
          <motion.div
            key={article.Id}
            className="absolute inset-4 top-8"
            style={{
              zIndex: 2 - index,
              scale: 0.95 - (index * 0.05),
              y: (index + 1) * 8,
            }}
            initial={{ scale: 0.9, opacity: 0.5 }}
            animate={{ scale: 0.95 - (index * 0.05), opacity: 0.7 - (index * 0.2) }}
            transition={{ duration: 0.3 }}
          >
            <ArticleCard
              article={article}
              className="h-full pointer-events-none"
            />
          </motion.div>
        ))}

        {/* Current card */}
        <motion.div
          ref={el => cardRefs.current[currentIndex] = el}
          className="absolute inset-4 top-4 z-10"
          style={{ x, y, rotate, opacity }}
          drag={!isLoading}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          whileTap={{ scale: 0.98 }}
        >
          <ArticleCard
            article={currentArticle}
            onClick={handleCardTap}
            className="h-full shadow-lg"
          />
          
          {/* Swipe Indicators */}
          <SwipeIndicator direction="left" opacity={leftOpacity} />
          <SwipeIndicator direction="right" opacity={rightOpacity} />
        </motion.div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-white text-sm font-medium">
            {remainingCards} left
          </span>
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-black/10 z-30 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white rounded-full p-3 shadow-lg">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default SwipeableStack