import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EstimateItemForm from "../EstimateItemForm";
import type { EstimateItem } from "@/types/estimate";

interface EstimateItemsSectionProps {
  items: EstimateItem[];
  isEditing: boolean;
  onUpdateItem: (index: number, item: EstimateItem) => void;
  onRemoveItem: (index: number) => void;
  onAddItem: () => void;
}

const EstimateItemsSection = ({
  items,
  isEditing,
  onUpdateItem,
  onRemoveItem,
  onAddItem,
}: EstimateItemsSectionProps) => {
  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const itemTotal = (item.quantity || 0) * (item.price || 0);
      return total + itemTotal;
    }, 0);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <Card className="print:shadow-none print:border-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Items</CardTitle>
        {isEditing && (
          <Button onClick={onAddItem} variant="outline" className="print:hidden">
            Add Item
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index}>
              {isEditing ? (
                <EstimateItemForm
                  item={item}
                  index={index}
                  onUpdate={onUpdateItem}
                  onRemove={onRemoveItem}
                />
              ) : (
                <div className="border p-4 rounded-lg space-y-2 print:border-none print:p-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.price || 0)}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity || 0}</p>
                    </div>
                  </div>
                  {item.quantity && item.price && (
                    <p className="text-sm text-right text-gray-600">
                      Subtotal: {formatCurrency(item.quantity * item.price)}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-gray-500 italic">No items added yet.</p>
          )}
          {items.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <p className="text-right font-medium text-lg">
                Total: {formatCurrency(calculateTotal())}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EstimateItemsSection;