import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

export const useEstimateDelete = (id: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      console.log('useEstimateDelete: Starting delete operation for estimate:', id);
      
      // First, verify the estimate exists
      const { data: existingEstimate, error: checkError } = await supabase
        .from('estimates')
        .select('id')
        .eq('id', id)
        .single();

      if (checkError) {
        console.error('useEstimateDelete: Error checking estimate:', checkError);
        throw checkError;
      }

      if (!existingEstimate) {
        console.error('useEstimateDelete: Estimate not found:', id);
        throw new Error('Estimate not found');
      }

      // Then soft delete it
      console.log('useEstimateDelete: Soft deleting estimate in database');
      const { error: deleteError } = await supabase
        .from('estimates')
        .update({ deleted: true })
        .eq('id', id);

      if (deleteError) {
        console.error('useEstimateDelete: Error deleting estimate:', deleteError);
        throw deleteError;
      }

      console.log('useEstimateDelete: Successfully soft deleted from database');

      // Remove from cache immediately
      queryClient.setQueryData(['estimates'], (oldData: any[] | undefined) => {
        if (!oldData) return [];
        console.log('useEstimateDelete: Removing estimate from cache');
        return oldData.filter(estimate => estimate.id !== id);
      });
    },
    onSuccess: () => {
      console.log('useEstimateDelete: Delete mutation succeeded');
      toast({
        title: "Estimate deleted",
        description: "The estimate has been successfully deleted",
      });
      
      // Remove from cache and refetch to ensure data is fresh
      console.log('useEstimateDelete: Cleaning up queries');
      queryClient.removeQueries({ queryKey: ['estimate', id] });
      queryClient.invalidateQueries({ queryKey: ['estimates'] });
    },
    onError: (error) => {
      console.error('useEstimateDelete: Error in delete mutation:', error);
      toast({
        title: "Error",
        description: "Failed to delete the estimate",
        variant: "destructive",
      });
    },
  });
};