import { motion } from 'framer-motion'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'sm',
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full"
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-secondary text-white",
    accent: "bg-accent text-white",
    success: "bg-success text-white",
    warning: "bg-warning text-white",
    error: "bg-error text-white",
    world: "bg-blue-100 text-blue-800",
    technology: "bg-purple-100 text-purple-800",
    business: "bg-green-100 text-green-800",
    sports: "bg-orange-100 text-orange-800",
    health: "bg-pink-100 text-pink-800",
    science: "bg-indigo-100 text-indigo-800"
  }
  
  const sizes = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  }

  const badgeClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={badgeClasses}
      {...props}
    >
      {children}
    </motion.span>
  )
}

export default Badge