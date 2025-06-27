import { NavLink, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import React, { useContext } from "react";
import { AuthContext } from "@/App";
import { routeArray } from "@/config/routes";
import ApperIcon from "@/components/ApperIcon";

const Layout = () => {
  const location = useLocation()
  const { logout } = useContext(AuthContext)

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>

{/* Bottom Navigation */}
      <nav className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {routeArray.map((route) => {
            const isActive = location.pathname === route.path || 
                           (route.path === '/feed' && location.pathname === '/')
            
            return (
              <NavLink
                key={route.id}
                to={route.path}
                className="relative flex flex-col items-center justify-center p-2 min-w-0 flex-1"
              >
                <div className="relative">
                  <ApperIcon 
                    name={route.icon} 
                    size={24}
                    className={`transition-colors duration-200 ${
                      isActive ? 'text-secondary' : 'text-gray-500'
                    }`}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-secondary rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
                <span className={`text-xs mt-1 font-medium transition-colors duration-200 ${
                  isActive ? 'text-secondary' : 'text-gray-500'
                }`}>
                  {route.label}
                </span>
              </NavLink>
            )
          })}
          
          {/* Logout Button */}
          <button
            onClick={logout}
            className="relative flex flex-col items-center justify-center p-2 min-w-0 flex-1"
          >
            <div className="relative">
              <ApperIcon 
                name="LogOut" 
                size={24}
                className="transition-colors duration-200 text-gray-500 hover:text-red-500"
              />
            </div>
            <span className="text-xs mt-1 font-medium transition-colors duration-200 text-gray-500 hover:text-red-500">
              Logout
            </span>
          </button>
</div>
      </nav>
    </div>
  )
}

export default Layout