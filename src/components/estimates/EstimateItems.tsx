import React from 'react';

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
    <div className="w-full">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 text-left">
        Items
      </h3>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border p-6 rounded-md text-left">
            <p className="font-medium">{item.name}</p>
            <div className="mt-2 text-gray-600">
              {item.quantity && <p>Quantity: {item.quantity}</p>}
              {item.price && <p>Price: ${item.price}</p>}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-gray-500 italic text-left">No items added yet. Record your voice to add items.</p>
        )}
      </div>
    </div>
  );
};

export default EstimateItems;