import React from 'react';
import { Card } from "@/components/ui/card";

interface EstimateItem {
  name: string;
  quantity?: number;
  price?: number;
}

interface EstimateItemsProps {
  items: EstimateItem[];
}

const EstimateItems = ({ items }: EstimateItemsProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Items
      </label>
      {items.map((item, index) => (
        <div key={index} className="border p-4 rounded-md mb-2">
          <p><strong>Item:</strong> {item.name}</p>
          {item.quantity && <p><strong>Quantity:</strong> {item.quantity}</p>}
          {item.price && <p><strong>Price:</strong> ${item.price}</p>}
        </div>
      ))}
      {items.length === 0 && (
        <p className="text-gray-500 italic">No items added yet. Record your voice to add items.</p>
      )}
    </div>
  );
};

export default EstimateItems;