import React from 'react';
import { Star } from 'lucide-react';

interface RatingDistributionProps {
  ratings: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  total: number;
}

export function RatingDistribution({ ratings, total }: RatingDistributionProps) {
  const getPercentage = (count: number) => {
    return total > 0 ? (count / total) * 100 : 0;
  };

  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-sm">Rating Distribution</h4>
      
      {[5, 4, 3, 2, 1].map((stars) => (
        <div key={stars} className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1 w-12">
            <span>{stars}</span>
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          </div>
          
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-yellow-400 transition-all duration-300"
              style={{ width: `${getPercentage(ratings[stars as keyof typeof ratings])}%` }}
            />
          </div>
          
          <div className="w-8 text-right text-muted-foreground">
            {ratings[stars as keyof typeof ratings]}
          </div>
        </div>
      ))}
      
      <div className="text-xs text-muted-foreground mt-2">
        Based on {total} reviews
      </div>
    </div>
  );
}