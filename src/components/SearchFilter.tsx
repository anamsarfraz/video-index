import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Filter, ChevronDown, Sparkles } from 'lucide-react';
import { FilterOption } from '../types';

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filter: string) => void;
  onCreatePod: () => void;
  onShowHero?: () => void;
  showHero?: boolean;
}

const filterOptions: FilterOption[] = [
  { value: 'recent', label: 'Recently Added' },
  { value: 'alphabetical', label: 'Alphabetical' },
  { value: 'most-accessed', label: 'Most Accessed' },
  { value: 'category', label: 'By Category' }
];

const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch, onFilter, onCreatePod, onShowHero, showHero = true }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('recent');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterSelect = (filterValue: string) => {
    setSelectedFilter(filterValue);
    setIsFilterOpen(false);
    onFilter(filterValue);
  };

  const handleLogoClick = () => {
    if (onShowHero) {
      onShowHero();
    }
  };
  return (
    <motion.div
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200/60 py-6 md:py-8 shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-8xl mx-auto px-4">
        {/* Logo/Brand - Only show when hero is hidden */}
        {!showHero && (
          <motion.div
            className="flex items-center justify-center mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={handleLogoClick}
              className="flex items-center space-x-3 text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-500 hover:to-indigo-500 transition-all duration-300"
            >
              <motion.div
                className="w-10 h-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-white font-bold">VI</span>
              </motion.div>
              <span>VideoIndex</span>
            </button>
          </motion.div>
        )}

        {/* Mobile Layout */}
        <div className="md:hidden space-y-4">
          {/* Search Bar - Full Width on Mobile */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search learning pods..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 bg-gray-50/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
            />
            {/* Search glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>

          {/* Filter and Create Button Row */}
          <div className="flex gap-3">
            {/* Filter Dropdown - Compact */}
            <div className="relative flex-1">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl hover:bg-gray-100/80 transition-all duration-200 text-gray-700"
              >
                <div className="flex items-center">
                  <Filter className="w-4 h-4 mr-2 text-gray-600" />
                  <span className="text-sm font-medium truncate">
                    {filterOptions.find(opt => opt.value === selectedFilter)?.label}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Filter Dropdown Menu */}
              {isFilterOpen && (
                <motion.div
                  className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-lg border border-gray-200/60 rounded-2xl shadow-xl z-50"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {filterOptions.map((option, index) => (
                    <button
                      key={option.value}
                      onClick={() => handleFilterSelect(option.value)}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-blue-50/80 transition-colors duration-200 ${
                        index === 0 ? 'rounded-t-2xl' : ''
                      } ${
                        index === filterOptions.length - 1 ? 'rounded-b-2xl' : ''
                      } ${
                        selectedFilter === option.value ? 'bg-blue-50/80 text-blue-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Create Pod Button - Compact */}
            <motion.button
              onClick={onCreatePod}
              className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 shadow-lg hover:shadow-xl min-w-[120px]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-5 h-5 mr-2" />
              <span className="text-sm">Create</span>
            </motion.button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex gap-6 items-center">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-3xl group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            
            {/* Enhanced Search Input with Glow Effect */}
            <input
              type="text"
              placeholder="Search learning pods with AI precision..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-16 py-4 bg-white/90 backdrop-blur-md border-2 border-gray-200/80 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 hover:border-blue-300/60 transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-lg hover:shadow-xl focus:shadow-2xl text-lg font-medium"
            />
            
            {/* Animated Search Glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-all duration-500 pointer-events-none blur-sm" />
            
            {/* Search Enhancement Icon */}
            <motion.div
              className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-all duration-300"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ 
                scale: searchQuery ? 1 : 0,
                rotate: searchQuery ? 360 : 0
              }}
              transition={{ duration: 0.4, type: "spring" }}
            >
              <div className="relative">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                </motion.div>
              </div>
            </motion.div>
            
            {/* Floating Search Suggestions Hint */}
            {!searchQuery && (
              <motion.div
                className="absolute right-16 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-1 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-full">
                  <span>Try "React" or "JavaScript"</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="relative group">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center px-6 py-3 bg-gray-50/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl hover:bg-gray-100/80 transition-all duration-200 text-gray-700 group-hover:border-gray-300/60"
            >
              <Filter className="w-4 h-4 mr-2 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {filterOptions.find(opt => opt.value === selectedFilter)?.label}
              </span>
              <ChevronDown className={`w-4 h-4 ml-2 text-gray-600 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Filter Dropdown Menu */}
            {isFilterOpen && (
              <motion.div
                className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-lg border border-gray-200/60 rounded-2xl shadow-xl z-50"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {filterOptions.map((option, index) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterSelect(option.value)}
                    className={`w-full px-4 py-3 text-left text-sm hover:bg-blue-50/80 transition-colors duration-200 ${
                      index === 0 ? 'rounded-t-2xl' : ''
                    } ${
                      index === filterOptions.length - 1 ? 'rounded-b-2xl' : ''
                    } ${
                      selectedFilter === option.value ? 'bg-blue-50/80 text-blue-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Create Pod Button */}
          <motion.button
            onClick={onCreatePod}
            className="group relative flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: '200% 100%',
              }}
            />
            <Plus className="relative z-10 w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-200" />
            <span className="relative z-10">Create Pod</span>
          </motion.button>
        </div>
      </div>
      
      {/* Click outside to close filter */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsFilterOpen(false)}
        />
      )}
    </motion.div>
  );
};

export default SearchFilter;