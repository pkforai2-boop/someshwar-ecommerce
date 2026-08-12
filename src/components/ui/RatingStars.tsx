import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  size?: number;
  showValue?: boolean;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, size = 16, showValue = false }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= Math.floor(rating) ? 'text-amber-400' : 'text-surface-200'}
          fill={star <= Math.floor(rating) ? 'currentColor' : 'none'}
        />
      ))}
      {showValue && <span className="text-sm font-medium text-surface-600 ml-1">{rating}</span>}
    </div>
  );
};

export default RatingStars;
