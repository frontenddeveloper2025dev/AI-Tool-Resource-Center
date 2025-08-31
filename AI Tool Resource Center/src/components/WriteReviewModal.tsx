import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, Plus, X, Loader2 } from 'lucide-react';
import { table } from '@devvai/devv-code-backend';
import { useAuthStore } from '@/store/auth-store';
import { useToast } from '@/hooks/use-toast';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
  category: string;
  onReviewSubmitted: () => void;
}

export function WriteReviewModal({ 
  isOpen, 
  onClose, 
  toolName, 
  category, 
  onReviewSubmitted 
}: WriteReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [pros, setPros] = useState<string[]>(['']);
  const [cons, setCons] = useState<string[]>(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();
  const { toast } = useToast();

  const handleClose = () => {
    onClose();
    setRating(0);
    setHoveredRating(0);
    setReviewText('');
    setPros(['']);
    setCons(['']);
  };

  const addProsCon = (type: 'pros' | 'cons') => {
    if (type === 'pros') {
      setPros([...pros, '']);
    } else {
      setCons([...cons, '']);
    }
  };

  const removeProsCon = (type: 'pros' | 'cons', index: number) => {
    if (type === 'pros') {
      setPros(pros.filter((_, i) => i !== index));
    } else {
      setCons(cons.filter((_, i) => i !== index));
    }
  };

  const updateProsCon = (type: 'pros' | 'cons', index: number, value: string) => {
    if (type === 'pros') {
      const newPros = [...pros];
      newPros[index] = value;
      setPros(newPros);
    } else {
      const newCons = [...cons];
      newCons[index] = value;
      setCons(newCons);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating || !reviewText.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please provide a rating and review text',
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to submit a review',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        tool_name: toolName,
        category: category,
        rating: rating,
        review_text: reviewText.trim(),
        reviewer_name: user.name || user.email.split('@')[0],
        reviewer_email: user.email,
        created_at: new Date().toISOString(),
        helpful_votes: 0,
        verified_user: 'true',
        pros: JSON.stringify(pros.filter(p => p.trim())),
        cons: JSON.stringify(cons.filter(c => c.trim()))
      };

      await table.addItem('evtx4fco5u68', reviewData);

      // Update aggregated ratings
      await updateToolRating(toolName, category, rating);

      toast({
        title: 'Review submitted!',
        description: 'Thank you for sharing your experience',
      });

      onReviewSubmitted();
      handleClose();
    } catch (error) {
      console.error('Failed to submit review:', error);
      toast({
        title: 'Submission failed',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateToolRating = async (tool: string, cat: string, newRating: number) => {
    try {
      // Get existing rating data
      const response = await table.getItems('evtx4xudlnnk', {
        query: { tool_name: tool },
        limit: 1
      });

      if (response.items.length > 0) {
        // Update existing rating
        const existing = response.items[0] as any;
        const totalReviews = existing.total_reviews + 1;
        const newAverage = ((existing.average_rating * existing.total_reviews) + newRating) / totalReviews;
        
        const ratingCounts = {
          five_star_count: existing.five_star_count + (newRating === 5 ? 1 : 0),
          four_star_count: existing.four_star_count + (newRating === 4 ? 1 : 0),
          three_star_count: existing.three_star_count + (newRating === 3 ? 1 : 0),
          two_star_count: existing.two_star_count + (newRating === 2 ? 1 : 0),
          one_star_count: existing.one_star_count + (newRating === 1 ? 1 : 0),
        };

        await table.updateItem('evtx4xudlnnk', {
          _uid: existing._uid,
          _id: existing._id,
          average_rating: Math.round(newAverage * 10) / 10,
          total_reviews: totalReviews,
          last_updated: new Date().toISOString(),
          ...ratingCounts
        });
      } else {
        // Create new rating entry
        const ratingData = {
          tool_name: tool,
          category: cat,
          description: `AI tool for ${cat.replace('_', ' ')} tasks`,
          average_rating: newRating,
          total_reviews: 1,
          five_star_count: newRating === 5 ? 1 : 0,
          four_star_count: newRating === 4 ? 1 : 0,
          three_star_count: newRating === 3 ? 1 : 0,
          two_star_count: newRating === 2 ? 1 : 0,
          one_star_count: newRating === 1 ? 1 : 0,
          trending: 'stable',
          featured: 'false',
          last_updated: new Date().toISOString()
        };

        await table.addItem('evtx4xudlnnk', ratingData);
      }
    } catch (error) {
      console.error('Failed to update tool rating:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Write a Review for {toolName}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Your Rating</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-colors"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating} out of 5 stars
                </span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <Label htmlFor="review">Your Review</Label>
            <Textarea
              id="review"
              placeholder="Share your experience with this AI tool..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Pros */}
          <div className="space-y-2">
            <Label>What did you like? (Optional)</Label>
            {pros.map((pro, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Add a positive point..."
                  value={pro}
                  onChange={(e) => updateProsCon('pros', index, e.target.value)}
                />
                {pros.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProsCon('pros', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => addProsCon('pros')}
              className="text-green-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add another pro
            </Button>
          </div>

          {/* Cons */}
          <div className="space-y-2">
            <Label>What could be improved? (Optional)</Label>
            {cons.map((con, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Add an area for improvement..."
                  value={con}
                  onChange={(e) => updateProsCon('cons', index, e.target.value)}
                />
                {cons.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProsCon('cons', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => addProsCon('cons')}
              className="text-red-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add another con
            </Button>
          </div>

          {/* Submit */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}