import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { EstimateItem } from '@/types/estimateDetail';

interface EstimateItemFormProps {
  item: EstimateItem;
  index: number;
  onUpdate: (index: number, updatedItem: EstimateItem) => void;
  onRemove: (index: number) => void;
}

const EstimateItemForm = ({ item, index, onUpdate, onRemove }: EstimateItemFormProps) => {
  return (
    <div className="flex gap-4 items-start p-4 border rounded-lg">
      <div className="flex-1 space-y-4">
        <Input
          value={item.name}
          onChange={(e) => onUpdate(index, { ...item, name: e.target.value })}
          placeholder="Item description"
        />
        <div className="flex gap-4">
          <Input
            type="number"
            value={item.quantity}
            onChange={(e) => onUpdate(index, { ...item, quantity: parseInt(e.target.value) || 0 })}
            placeholder="Quantity"
          />
          <Input
            type="number"
            value={item.price}
            onChange={(e) => onUpdate(index, { ...item, price: parseFloat(e.target.value) || 0 })}
            placeholder="Price"
          />
        </div>
      </div>
      <Button
        type="button"
        variant="destructive"
        onClick={() => onRemove(index)}
      >
        Remove
      </Button>
    </div>
  );
};

export default EstimateItemForm;