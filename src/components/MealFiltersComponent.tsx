import React, { useState, useEffect } from 'react';
import { Search, Filter, SortAsc, SortDesc, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import type { MealCategory, MealFilters, DietaryTag } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"


interface MealFiltersComponentProps {
  filters: MealFilters;
  onFiltersChange: (filters: MealFilters) => void;
  dietaryTags: DietaryTag[];
  showArchived: boolean;
  onToggleArchived: () => void;
}

export const MealFiltersComponent: React.FC<MealFiltersComponentProps> = ({
  filters,
  onFiltersChange,
  dietaryTags,
  showArchived,
  onToggleArchived
}) => {
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  // Update local search when filters change (e.g., when cleared)
  useEffect(() => {
    setLocalSearch(filters.search || '');
  }, [filters.search]);

  // Debounced search update
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmedSearch = localSearch.trim();
      if (trimmedSearch !== (filters.search || '')) {
        onFiltersChange({ ...filters, search: trimmedSearch || undefined });
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [localSearch, filters, onFiltersChange]);

  const handleSearchChange = (search: string) => {
    setLocalSearch(search);
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category: category === 'all' ? undefined : category as MealCategory
    });
  };

  const handleSortChange = (sortBy: string, sortOrder: string) => {
    onFiltersChange({
      ...filters,
      sort_by: sortBy as any,
      sort_order: sortOrder as 'asc' | 'desc'
    });
  };

  const handleDietaryTagToggle = (tagId: number) => {
    const currentTags = filters.dietary_tags || [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter(id => id !== tagId)
      : [...currentTags, tagId];

    onFiltersChange({
      ...filters,
      dietary_tags: newTags.length > 0 ? newTags : undefined
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = filters.search || filters.category || (filters.dietary_tags && filters.dietary_tags.length > 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filters & Search
        </h3>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="text-gray-600 hover:text-gray-700"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleArchived}
            className={showArchived ? 'bg-red-50 text-red-700 border-red-200' : ''}
          >
            {showArchived ? 'Show Active' : 'Show Archived'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Meals
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by meal name..."
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meal Category
          </label>

          <Select
            value={filters.category || 'all'}
            onValueChange={(value) => handleCategoryChange(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Best for Breakfast">Best for Breakfast</SelectItem>
              <SelectItem value="Best for Lunch">Best for Lunch</SelectItem>
              <SelectItem value="Best for Dinner">Best for Dinner</SelectItem>
              <SelectItem value="Best for Snacks">Best for Snacks</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <div className="flex space-x-2">
            <Select
              value={filters.sort_by || 'created_at'}
              onValueChange={(value) => handleSortChange(value, filters.sort_order || 'desc')}
            >
              <SelectTrigger className="flex-1">
              <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="created_at">Date Created</SelectItem>
              <SelectItem value="estimated_price">Price</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => handleSortChange(filters.sort_by || 'created_at', filters.sort_order === 'asc' ? 'desc' : 'asc')}
              className="px-3"
            >
              {filters.sort_order === 'asc' ? (
                <SortAsc className="w-4 h-4" />
              ) : (
                <SortDesc className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Dietary Tags */}
      {dietaryTags.length > 0 && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dietary Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {dietaryTags.map((tag) => (
              <button
                key={tag.tag_id}
                type="button"
                onClick={() => handleDietaryTagToggle(tag.tag_id)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${filters.dietary_tags?.includes(tag.tag_id)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {tag.tag_name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-gray-600 font-medium">Active filters:</span>
            {filters.search && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Search: "{filters.search}"
              </span>
            )}
            {filters.category && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                Category: {filters.category}
              </span>
            )}
            {filters.dietary_tags && filters.dietary_tags.length > 0 && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Tags: {filters.dietary_tags.length} selected
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
