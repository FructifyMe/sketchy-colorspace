import { Button } from "@/components/ui/button";
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
    <div className="print:mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold print:text-xl">Items</h2>
        {isEditing && (
          <Button onClick={onAddItem} variant="outline" className="print:hidden">
            Add Item
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 print:text-sm">Description</th>
                <th className="text-right py-2 print:text-sm">Quantity</th>
                <th className="text-right py-2 print:text-sm">Price</th>
                <th className="text-right py-2 print:text-sm">Total</th>
                {isEditing && <th className="print:hidden"></th>}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b">
                  {isEditing ? (
                    <td colSpan={4}>
                      <EstimateItemForm
                        item={item}
                        index={index}
                        onUpdate={onUpdateItem}
                        onRemove={onRemoveItem}
                      />
                    </td>
                  ) : (
                    <>
                      <td className="py-2 print:text-sm">{item.name}</td>
                      <td className="text-right py-2 print:text-sm">{item.quantity}</td>
                      <td className="text-right py-2 print:text-sm">{formatCurrency(item.price || 0)}</td>
                      <td className="text-right py-2 print:text-sm">
                        {formatCurrency((item.quantity || 0) * (item.price || 0))}
                      </td>
                    </>
                  )}
                  {isEditing && (
                    <td className="print:hidden">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onRemoveItem(index)}
                      >
                        Remove
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-900">
                <td colSpan={3} className="py-2 text-right font-semibold print:text-sm">Total:</td>
                <td className="py-2 text-right font-semibold print:text-sm">
                  {formatCurrency(calculateTotal())}
                </td>
                {isEditing && <td className="print:hidden"></td>}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EstimateItemsSection;