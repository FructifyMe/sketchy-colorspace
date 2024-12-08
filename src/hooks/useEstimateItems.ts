import type { Estimate, EstimateItem } from '@/types/estimateDetail';
import { useEstimateUpdate } from './useEstimateUpdate';

export const useEstimateItems = (id: string) => {
  const updateMutation = useEstimateUpdate(id);

  const handleUpdateItem = (estimate: Estimate, index: number, updatedItem: EstimateItem) => {
    const newItems = [...estimate.items];
    newItems[index] = updatedItem;
    
    updateMutation.mutate({
      ...estimate,
      items: newItems,
    });
  };

  const handleRemoveItem = (estimate: Estimate, index: number) => {
    const newItems = estimate.items.filter((_, i) => i !== index);
    updateMutation.mutate({
      ...estimate,
      items: newItems,
    });
  };

  const handleAddItem = (estimate: Estimate) => {
    const newItem: EstimateItem = {
      name: '',
      quantity: 1,
      price: 0
    };
    
    updateMutation.mutate({
      ...estimate,
      items: [...estimate.items, newItem],
    });
  };

  return {
    handleUpdateItem,
    handleRemoveItem,
    handleAddItem
  };
};