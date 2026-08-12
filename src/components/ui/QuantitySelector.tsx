import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity: number;
  onChange: (quantity: number) => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, maxQuantity, onChange }) => {
  return (
    <div className="flex items-center gap-0 border border-surface-200 rounded-lg overflow-hidden w-fit">
      <button
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        className="w-9 h-9 flex items-center justify-center text-surface-600 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <Minus size={16} />
      </button>
      <span className="w-10 h-9 flex items-center justify-center text-sm font-semibold text-surface-800 border-x border-surface-200 bg-surface-50">
        {quantity}
      </span>
      <button
        onClick={() => onChange(Math.min(maxQuantity, quantity + 1))}
        disabled={quantity >= maxQuantity}
        className="w-9 h-9 flex items-center justify-center text-surface-600 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default QuantitySelector;
