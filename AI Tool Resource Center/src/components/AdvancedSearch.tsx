import React, { useState, useEffect } from 'react';
import { Search, Filter, X, SlidersHorizontal, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { table } from '@devvai/devv-code-backend';

interface SearchFilters {
  query: string;
  categories: string[];
  pricingModels: string[];
  ratingRange: [number, number];
  trendingScoreRange: [number, number];
  testCountRange: [number, number];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface SearchResult {
  _id: string;
  tool_id: string;
  tool_name: string;
  category: string;
  description: string;
  avg_rating: number;
  tests_count: number;
  trending_score: number;
  pricing_model: string;
  tags?: string;
  website_url?: string;
}

interface AdvancedSearchProps {
  onResultsChange: (results: SearchResult[]) => void;
  initialQuery?: string;
}

const categories = [
  'Text Generation',
  'Image Creation',
  'Code Assistant',
  'Data Analysis',
  'Audio Processing',
  'Video Editing',
  'Chatbots',
  'Translation',
  'Content Writing'
];

const pricingModels = ['Free', 'Freemium', 'Paid', 'Enterprise'];

const sortOptions = [
  { value: 'trending_score', label: 'Trending Score' },
  { value: 'avg_rating', label: 'Rating' },
  { value: 'tests_count', label: 'Test Count' },
  { value: 'views_count', label: 'Popularity' },
  { value: 'tool_name', label: 'Name' }
];

export default function AdvancedSearch({ onResultsChange, initialQuery = '' }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: initialQuery,
    categories: [],
    pricingModels: [],
    ratingRange: [0, 5],
    trendingScoreRange: [0, 100],
    testCountRange: [0, 10000],
    sortBy: 'trending_score',
    sortOrder: 'desc'
  });
  
  const [allTools, setAllTools] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    loadAllTools();
  }, []);

  useEffect(() => {
    if (allTools.length > 0) {
      performSearch();
    }
  }, [filters, allTools]);

  const loadAllTools = async () => {
    try {
      setLoading(true);
      const response = await table.getItems('evxj3vkz0idc', {
        limit: 100
      });
      setAllTools(response.items as SearchResult[]);
    } catch (error) {
      console.error('Failed to load tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = () => {
    let results = [...allTools];

    // Text search
    if (filters.query.trim()) {
      const query = filters.query.toLowerCase();
      results = results.filter(tool =>
        tool.tool_name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query) ||
        (tool.tags && tool.tags.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      results = results.filter(tool => filters.categories.includes(tool.category));
    }

    // Pricing model filter
    if (filters.pricingModels.length > 0) {
      results = results.filter(tool => filters.pricingModels.includes(tool.pricing_model));
    }

    // Rating range filter
    results = results.filter(tool => 
      tool.avg_rating >= filters.ratingRange[0] && 
      tool.avg_rating <= filters.ratingRange[1]
    );

    // Trending score range filter
    results = results.filter(tool => 
      tool.trending_score >= filters.trendingScoreRange[0] && 
      tool.trending_score <= filters.trendingScoreRange[1]
    );

    // Test count range filter
    results = results.filter(tool => 
      tool.tests_count >= filters.testCountRange[0] && 
      tool.tests_count <= filters.testCountRange[1]
    );

    // Sort results
    results.sort((a, b) => {
      const aValue = a[filters.sortBy as keyof SearchResult] as number | string;
      const bValue = b[filters.sortBy as keyof SearchResult] as number | string;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return filters.sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      const numA = Number(aValue) || 0;
      const numB = Number(bValue) || 0;
      
      return filters.sortOrder === 'asc' ? numA - numB : numB - numA;
    });

    onResultsChange(results);
  };

  const updateFilters = (updates: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      categories: [],
      pricingModels: [],
      ratingRange: [0, 5],
      trendingScoreRange: [0, 100],
      testCountRange: [0, 10000],
      sortBy: 'trending_score',
      sortOrder: 'desc'
    });
  };

  const hasActiveFilters = () => {
    return filters.categories.length > 0 ||
           filters.pricingModels.length > 0 ||
           filters.ratingRange[0] > 0 || filters.ratingRange[1] < 5 ||
           filters.trendingScoreRange[0] > 0 || filters.trendingScoreRange[1] < 100 ||
           filters.testCountRange[0] > 0 || filters.testCountRange[1] < 10000;
  };

  const getFilterCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.pricingModels.length > 0) count++;
    if (filters.ratingRange[0] > 0 || filters.ratingRange[1] < 5) count++;
    if (filters.trendingScoreRange[0] > 0 || filters.trendingScoreRange[1] < 100) count++;
    if (filters.testCountRange[0] > 0 || filters.testCountRange[1] < 10000) count++;
    return count;
  };

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search AI tools by name, description, or category..."
            value={filters.query}
            onChange={(e) => updateFilters({ query: e.target.value })}
            className="pl-10 pr-4"
          />
        </div>
        
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {getFilterCount() > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {getFilterCount()}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-96 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Search Filters</SheetTitle>
              <SheetDescription>
                Refine your search with advanced filters
              </SheetDescription>
            </SheetHeader>
            
            <div className="space-y-6 mt-6">
              {/* Sort Options */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Sort By</Label>
                <div className="flex gap-2">
                  <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select 
                    value={filters.sortOrder} 
                    onValueChange={(value: 'asc' | 'desc') => updateFilters({ sortOrder: value })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Descending</SelectItem>
                      <SelectItem value="asc">Ascending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Categories */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Categories</Label>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={filters.categories.includes(category)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilters({ categories: [...filters.categories, category] });
                          } else {
                            updateFilters({ categories: filters.categories.filter(c => c !== category) });
                          }
                        }}
                      />
                      <Label htmlFor={category} className="text-sm">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Pricing Models */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Pricing Model</Label>
                <div className="space-y-2">
                  {pricingModels.map(model => (
                    <div key={model} className="flex items-center space-x-2">
                      <Checkbox
                        id={model}
                        checked={filters.pricingModels.includes(model)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilters({ pricingModels: [...filters.pricingModels, model] });
                          } else {
                            updateFilters({ pricingModels: filters.pricingModels.filter(p => p !== model) });
                          }
                        }}
                      />
                      <Label htmlFor={model} className="text-sm">
                        {model}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Rating Range */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Rating Range: {filters.ratingRange[0]} - {filters.ratingRange[1]} ⭐
                </Label>
                <Slider
                  value={filters.ratingRange}
                  onValueChange={(value) => updateFilters({ ratingRange: value as [number, number] })}
                  min={0}
                  max={5}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <Separator />

              {/* Trending Score Range */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Trending Score: {filters.trendingScoreRange[0]} - {filters.trendingScoreRange[1]}
                </Label>
                <Slider
                  value={filters.trendingScoreRange}
                  onValueChange={(value) => updateFilters({ trendingScoreRange: value as [number, number] })}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <Separator />

              {/* Test Count Range */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Test Count: {filters.testCountRange[0]} - {filters.testCountRange[1]}+
                </Label>
                <Slider
                  value={filters.testCountRange}
                  onValueChange={(value) => updateFilters({ testCountRange: value as [number, number] })}
                  min={0}
                  max={10000}
                  step={100}
                  className="w-full"
                />
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="flex-1"
                  disabled={!hasActiveFilters()}
                >
                  Clear All
                </Button>
                <Button 
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters Display */}
      {(hasActiveFilters() || filters.query) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {filters.query && (
            <Badge variant="secondary" className="gap-1">
              Search: "{filters.query}"
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ query: '' })}
              />
            </Badge>
          )}
          
          {filters.categories.map(category => (
            <Badge key={category} variant="secondary" className="gap-1">
              {category}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ 
                  categories: filters.categories.filter(c => c !== category) 
                })}
              />
            </Badge>
          ))}
          
          {filters.pricingModels.map(model => (
            <Badge key={model} variant="secondary" className="gap-1">
              {model}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ 
                  pricingModels: filters.pricingModels.filter(p => p !== model) 
                })}
              />
            </Badge>
          ))}
          
          {(filters.ratingRange[0] > 0 || filters.ratingRange[1] < 5) && (
            <Badge variant="secondary" className="gap-1">
              Rating: {filters.ratingRange[0]} - {filters.ratingRange[1]} ⭐
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ ratingRange: [0, 5] })}
              />
            </Badge>
          )}
          
          {hasActiveFilters() && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="h-6 px-2 text-xs"
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  );
}