import React from 'react';
import type { EstimateItem } from '@/types/estimate';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface EstimateItemsProps {
  items: EstimateItem[];
}

const EstimateItems = ({ items }: EstimateItemsProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-base">Items</Label>
      <div className="space-y-3">
        {items.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-3 sm:p-4">
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground">
                    ${(item.quantity * (item.price || 0)).toFixed(2)}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  {item.quantity && (
                    <div>
                      <span className="font-medium">Qty:</span> {item.quantity}
                    </div>
                  )}
                  {item.price && (
                    <div>
                      <span className="font-medium">Price:</span> ${item.price}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <div className="text-sm text-muted-foreground italic text-center py-4">
            No items added yet. Record your voice to add items.
          </div>
        )}
      </div>
    </div>
  );
};

export default EstimateItems;