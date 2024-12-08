import type { Estimate, EstimateItem } from '@/types/estimateDetail';
import { useEstimateDelete } from './useEstimateDelete';
import { useEstimateUpdate } from './useEstimateUpdate';
import { useEstimateItems } from './useEstimateItems';

export const useEstimateOperations = (id: string) => {
  const deleteMutation = useEstimateDelete(id);
  const updateMutation = useEstimateUpdate(id);
  const { handleUpdateItem, handleRemoveItem, handleAddItem } = useEstimateItems(id);

  return {
    deleteMutation,
    updateMutation,
    handleUpdateItem,
    handleRemoveItem,
    handleAddItem
  };
};