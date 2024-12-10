import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EstimateItem } from '@/types/estimateDetail';

interface EstimateItemFormProps {
  item: EstimateItem;
  index: number;
  onUpdate: (index: number, updatedItem: EstimateItem) => void;
  onRemove: (index: number) => void;
}

const EstimateItemForm = ({ item, index, onUpdate, onRemove }: EstimateItemFormProps) => {
  const handleNumericChange = (
    field: keyof Pick<EstimateItem, 'quantity' | 'price'>,
    value: string,
    parser: (val: string) => number
  ) => {
    const parsedValue = parser(value);
    if (!isNaN(parsedValue)) {
      onUpdate(index, { ...item, [field]: parsedValue });
    }
  };

  return (
    <div className="flex gap-4 items-start p-4 border rounded-lg">
      <div className="flex-1 space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`item-name-${index}`}>Item Description</Label>
          <Input
            id={`item-name-${index}`}
            value={item.name}
            onChange={(e) => onUpdate(index, { ...item, name: e.target.value })}
            placeholder="Enter item description"
            aria-label="Item description"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <Label htmlFor={`item-quantity-${index}`}>Quantity</Label>
            <Input
              id={`item-quantity-${index}`}
              type="number"
              min="0"
              step="1"
              value={item.quantity}
              onChange={(e) => handleNumericChange('quantity', e.target.value, parseInt)}
              placeholder="Enter quantity"
              aria-label="Item quantity"
            />
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor={`item-price-${index}`}>Price</Label>
            <Input
              id={`item-price-${index}`}
              type="number"
              min="0"
              step="0.01"
              value={item.price}
              onChange={(e) => handleNumericChange('price', e.target.value, parseFloat)}
              placeholder="Enter price"
              aria-label="Item price"
            />
          </div>
        </div>
      </div>
      <Button
        type="button"
        variant="destructive"
        onClick={() => onRemove(index)}
        aria-label={`Remove item ${index + 1}`}
      >
        Remove
      </Button>
    </div>
  );
};

export default EstimateItemForm;