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
      <CardHeader className="flex flex-row items-center justify-between print:py-1">
        <CardTitle className="text-sm font-semibold">Items</CardTitle>
        {isEditing && (
          <Button onClick={onAddItem} variant="outline" className="print:hidden">
            Add Item
          </Button>
        )}
      </CardHeader>
      <CardContent className="py-2 print:py-1">
        {/* Print-optimized table */}
        <div className="hidden print:block">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-1 text-left font-semibold w-1/2">Description</th>
                <th className="py-1 text-left font-semibold w-1/6">Quantity</th>
                <th className="py-1 text-left font-semibold w-1/6">Unit Price</th>
                <th className="py-1 text-left font-semibold w-1/6">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-1 text-left">{item.name}</td>
                  <td className="py-1 text-left">{item.quantity}</td>
                  <td className="py-1 text-left">{formatCurrency(item.price)}</td>
                  <td className="py-1 text-left">{formatCurrency(item.quantity * item.price)}</td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td colSpan={3} className="py-2 text-left">Total:</td>
                <td className="py-2 text-left">{formatCurrency(calculateTotal())}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Interactive edit view (hidden in print) */}
        <div className="print:hidden space-y-4">
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
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="text-left">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="font-medium text-left">
                    {formatCurrency(item.quantity * item.price)}
                  </p>
                </div>
              )}
            </div>
          ))}
          <div className="flex justify-end border-t pt-4">
            <p className="font-semibold">
              Total: {formatCurrency(calculateTotal())}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EstimateItemsSection;