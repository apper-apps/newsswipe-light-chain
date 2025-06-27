import { useState } from 'react'
import { motion } from 'framer-motion'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search articles...", 
  className = '',
  showClearButton = true 
}) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  const handleClear = () => {
    setSearchTerm('')
    onSearch('')
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    // Real-time search with debounce would go here
    // For now, we'll just update the state
  }

  return (
    <motion.form
      onSubmit={handleSearch}
      className={`flex gap-2 ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex-1 relative">
        <Input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          icon="Search"
          className="pr-10"
        />
        {showClearButton && searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.div>
          </button>
        )}
      </div>
      <Button type="submit" variant="primary">
        Search
      </Button>
    </motion.form>
  )
}

export default SearchBar