import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, MessageSquare, TrendingUp, Award } from 'lucide-react';
import { table } from '@devvai/devv-code-backend';
import { useAuthStore } from '@/store/auth-store';
import { AuthModal } from './AuthModal';
import { WriteReviewModal } from './WriteReviewModal';
import { ReviewCard } from './ReviewCard';
import { RatingDistribution } from './RatingDistribution';

interface ToolRating {
  _id: string;
  tool_name: string;
  category: string;
  description: string;
  website_url?: string;
  average_rating: number;
  total_reviews: number;
  five_star_count: number;
  four_star_count: number;
  three_star_count: number;
  two_star_count: number;
  one_star_count: number;
  trending: string;
  featured: string;
}

interface Review {
  _id: string;
  tool_name: string;
  category: string;
  rating: number;
  review_text: string;
  reviewer_name: string;
  created_at: string;
  helpful_votes: number;
  verified_user: string;
  pros: string;
  cons: string;
}

interface ReviewSystemProps {
  toolName?: string;
  category?: string;
}

export function ReviewSystem({ toolName, category }: ReviewSystemProps) {
  const [toolRatings, setToolRatings] = useState<ToolRating[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedTool, setSelectedTool] = useState<ToolRating | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'helpful' | 'rating'>('newest');
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    loadToolRatings();
  }, [category]);

  useEffect(() => {
    if (selectedTool) {
      loadReviews(selectedTool.tool_name);
    }
  }, [selectedTool, sortBy]);

  const loadToolRatings = async () => {
    try {
      setIsLoading(true);
      const response = await table.getItems('evtx4xudlnnk', {
        limit: 20,
        ...(category && { query: { category } }),
        sort: 'average_rating',
        order: 'desc'
      });
      setToolRatings(response.items as ToolRating[]);
      
      // If a specific tool is requested, select it
      if (toolName) {
        const tool = response.items.find((t: any) => t.tool_name === toolName);
        if (tool) setSelectedTool(tool as ToolRating);
      } else if (response.items.length > 0) {
        setSelectedTool(response.items[0] as ToolRating);
      }
    } catch (error) {
      console.error('Failed to load tool ratings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadReviews = async (tool: string) => {
    try {
      const response = await table.getItems('evtx4fco5u68', {
        query: { tool_name: tool },
        limit: 50,
        sort: '_id',
        order: sortBy === 'newest' ? 'desc' : 'asc'
      });
      
      let sortedReviews = response.items as Review[];
      if (sortBy === 'helpful') {
        sortedReviews.sort((a, b) => b.helpful_votes - a.helpful_votes);
      } else if (sortBy === 'rating') {
        sortedReviews.sort((a, b) => b.rating - a.rating);
      }
      
      setReviews(sortedReviews);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  };

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setShowReviewModal(true);
  };

  const renderRatingStars = (rating: number, size = 'sm') => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tool Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {toolRatings.map((tool) => (
          <Card 
            key={tool._id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTool?._id === tool._id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedTool(tool)}
          >
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-sm line-clamp-2">{tool.tool_name}</h3>
                  {tool.featured === 'true' && (
                    <Award className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {renderRatingStars(tool.average_rating)}
                  <span className="text-sm font-medium">{tool.average_rating.toFixed(1)}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{tool.total_reviews} reviews</span>
                  {tool.trending === 'hot' && (
                    <Badge variant="destructive" className="text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Hot
                    </Badge>
                  )}
                  {tool.trending === 'rising' && (
                    <Badge variant="secondary" className="text-xs">Rising</Badge>
                  )}
                </div>
                
                <Badge variant="outline" className="text-xs w-fit">
                  {tool.category.replace('_', ' ')}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Tool Details */}
      {selectedTool && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tool Info & Rating Distribution */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedTool.tool_name}</span>
                  {selectedTool.featured === 'true' && (
                    <Award className="h-5 w-5 text-yellow-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {selectedTool.description}
                </p>
                
                {selectedTool.website_url && (
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <a href={selectedTool.website_url} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  </Button>
                )}
                
                <div className="flex items-center gap-4">
                  {renderRatingStars(selectedTool.average_rating, 'lg')}
                  <div>
                    <div className="text-2xl font-bold">{selectedTool.average_rating.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedTool.total_reviews} reviews
                    </div>
                  </div>
                </div>

                <RatingDistribution 
                  ratings={{
                    5: selectedTool.five_star_count,
                    4: selectedTool.four_star_count,
                    3: selectedTool.three_star_count,
                    2: selectedTool.two_star_count,
                    1: selectedTool.one_star_count,
                  }}
                  total={selectedTool.total_reviews}
                />

                <Button onClick={handleWriteReview} className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Write a Review
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Reviews */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Reviews ({reviews.length})</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border rounded px-3 py-1"
              >
                <option value="newest">Newest first</option>
                <option value="helpful">Most helpful</option>
                <option value="rating">Highest rated</option>
              </select>
            </div>

            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No reviews yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Be the first to share your experience with {selectedTool.tool_name}
                    </p>
                    <Button onClick={handleWriteReview}>
                      Write the first review
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      {selectedTool && (
        <WriteReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          toolName={selectedTool.tool_name}
          category={selectedTool.category}
          onReviewSubmitted={() => {
            loadReviews(selectedTool.tool_name);
            loadToolRatings();
          }}
        />
      )}
    </div>
  );
}