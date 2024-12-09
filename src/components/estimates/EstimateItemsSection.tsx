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

  const calculateSubtotal = () => {
    return calculateTotal();
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.05; // 5% tax rate
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
    <div className="space-y-4 print:space-y-2">
      {isEditing ? (
        <div className="print:hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Items</h3>
            <Button onClick={onAddItem} variant="outline">
              Add Item
            </Button>
          </div>
          <div className="space-y-4">
            {items.map((item, index) => (
              <EstimateItemForm
                key={index}
                item={item}
                index={index}
                onUpdate={onUpdateItem}
                onRemove={onRemoveItem}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#003087] text-white">
                <th className="py-2 px-4 text-left">QTY</th>
                <th className="py-2 px-4 text-left">Description</th>
                <th className="py-2 px-4 text-right">Unit Price</th>
                <th className="py-2 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">{item.quantity}</td>
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="py-2 px-4 text-right">{formatCurrency(item.price || 0)}</td>
                  <td className="py-2 px-4 text-right">
                    {formatCurrency((item.quantity || 0) * (item.price || 0))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">Subtotal</span>
              <span>{formatCurrency(calculateSubtotal())}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">Sales Tax (5%)</span>
              <span>{formatCurrency(calculateTax())}</span>
            </div>
            <div className="flex justify-between border-t border-double border-t-2 pt-2 font-bold">
              <span>Total (USD)</span>
              <span>{formatCurrency(calculateTotal() + calculateTax())}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstimateItemsSection;