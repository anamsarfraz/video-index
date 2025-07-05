import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Filter, ChevronDown } from 'lucide-react';
import { FilterOption } from '../types';

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filter: string) => void;
  onCreatePod: () => void;
}

const filterOptions: FilterOption[] = [
  { value: 'recent', label: 'Recently Added' },
  { value: 'alphabetical', label: 'Alphabetical' },
  { value: 'most-accessed', label: 'Most Accessed' },
  { value: 'category', label: 'By Category' }
];

const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch, onFilter, onCreatePod }) => {
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

  return (
    <motion.div
      className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 py-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search your learning pods..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center px-4 py-3 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <Filter className="w-4 h-4 mr-2 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {filterOptions.find(opt => opt.value === selectedFilter)?.label}
              </span>
              <ChevronDown className="w-4 h-4 ml-2 text-gray-600" />
            </button>

            {isFilterOpen && (
              <motion.div
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterSelect(option.value)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
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
            className="flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Pod
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchFilter;