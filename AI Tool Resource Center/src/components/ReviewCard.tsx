import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, User, Calendar, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useToast } from '@/hooks/use-toast';

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

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const handleHelpfulVote = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to vote on reviews',
        variant: 'destructive',
      });
      return;
    }

    if (hasVoted) {
      toast({
        title: 'Already voted',
        description: 'You have already voted on this review',
        variant: 'destructive',
      });
      return;
    }

    // In a real implementation, this would update the database
    setHasVoted(true);
    toast({
      title: 'Thank you!',
      description: 'Your vote has been recorded',
    });
  };

  const parseProsAndCons = (jsonString: string): string[] => {
    try {
      return JSON.parse(jsonString) || [];
    } catch {
      return [];
    }
  };

  const pros = parseProsAndCons(review.pros);
  const cons = parseProsAndCons(review.cons);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{review.reviewer_name}</span>
                  {review.verified_user === 'true' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {formatDate(review.created_at)}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              {renderRatingStars(review.rating)}
              <div className="text-sm text-muted-foreground mt-1">
                {review.rating}/5 stars
              </div>
            </div>
          </div>

          {/* Review Content */}
          <div className="space-y-3">
            <p className="text-gray-700 leading-relaxed">{review.review_text}</p>

            {/* Pros and Cons */}
            {(pros.length > 0 || cons.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {pros.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-700 text-sm">Pros</h4>
                    <ul className="space-y-1">
                      {pros.map((pro, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-green-500 mt-1">+</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {cons.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-red-700 text-sm">Cons</h4>
                    <ul className="space-y-1">
                      {cons.map((con, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-red-500 mt-1">-</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHelpfulVote}
              disabled={hasVoted}
              className={hasVoted ? 'text-green-600' : ''}
            >
              <ThumbsUp className={`h-4 w-4 mr-2 ${hasVoted ? 'fill-current' : ''}`} />
              Helpful ({review.helpful_votes + (hasVoted ? 1 : 0)})
            </Button>
            
            <Badge variant="outline" className="text-xs">
              {review.category.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}