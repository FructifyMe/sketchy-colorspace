import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import type { Estimate } from '@/types/estimateDetail';
import { toSupabaseJson } from '@/types/estimateDetail';

export const useEstimateUpdate = (id: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
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
};