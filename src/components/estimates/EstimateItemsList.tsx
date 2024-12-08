import React from 'react';
import { Button } from "@/components/ui/button";
import EstimateItemForm from '../EstimateItemForm';
import type { EstimateItem } from '@/types/estimateDetail';

interface EstimateItemsListProps {
  items: EstimateItem[];
  onUpdateItem: (index: number, item: EstimateItem) => void;
  onRemoveItem: (index: number) => void;
  onAddItem: () => void;
  sections: Array<{ name: string }>;
}

const EstimateItemsList = ({ 
  items, 
  onUpdateItem, 
  onRemoveItem, 
  onAddItem,
  sections 
}: EstimateItemsListProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Items</h3>
      {sections.map((section, index) => (
        <div key={index} className="space-y-4">
          <h4 className="font-medium text-gray-700">{section.name}</h4>
          <EstimateItemForm
            item={items[index] || { name: '', quantity: 0, price: 0 }}
            index={index}
            onUpdate={onUpdateItem}
            onRemove={onRemoveItem}
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={onAddItem}
      >
        Add Item
      </Button>
    </div>
  );
};

export default EstimateItemsList;