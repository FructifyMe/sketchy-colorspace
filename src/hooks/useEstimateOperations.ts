import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import type { Estimate, EstimateItem } from '@/types/estimateDetail';
import { toSupabaseJson } from '@/types/estimateDetail';

export const useEstimateOperations = (id: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      console.log('Deleting estimate:', id);
      const { error } = await supabase
        .from('estimates')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Estimate deleted",
        description: "The estimate has been successfully deleted",
      });
      // Invalidate both the specific estimate and the estimates list queries
      queryClient.invalidateQueries({ queryKey: ['estimate', id] });
      queryClient.invalidateQueries({ queryKey: ['estimates'] });
    },
    onError: (error) => {
      console.error('Error deleting estimate:', error);
      toast({
        title: "Error",
        description: "Failed to delete the estimate",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedData: Partial<Estimate>) => {
      console.log('Updating estimate:', id, updatedData);
      const { error } = await supabase
        .from('estimates')
        .update({
          items: toSupabaseJson(updatedData.items),
          client_info: updatedData.client_info ? toSupabaseJson(updatedData.client_info) : null,
          description: updatedData.description,
          status: updatedData.status,
          terms_and_conditions: updatedData.terms_and_conditions,
          payment_policy: updatedData.payment_policy,
          notes: updatedData.notes,
          show_terms: updatedData.show_terms,
          show_payment_policy: updatedData.show_payment_policy
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Estimate updated",
        description: "Changes have been saved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['estimate', id] });
    },
    onError: (error) => {
      console.error('Error updating estimate:', error);
      toast({
        title: "Error",
        description: "Failed to update the estimate",
        variant: "destructive",
      });
    },
  });

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
    deleteMutation,
    updateMutation,
    handleUpdateItem,
    handleRemoveItem,
    handleAddItem
  };
};