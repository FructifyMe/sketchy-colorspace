import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

export const useEstimateDelete = (id: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      console.log('Starting deletion of estimate:', id);
      const { data, error } = await supabase
        .from('estimates')
        .delete()
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error in deletion query:', error);
        throw error;
      }

      console.log('Deletion successful, deleted data:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Deletion mutation succeeded, invalidating queries');
      
      // Immediately remove the estimate from the cache
      queryClient.setQueryData(['estimates'], (oldData: any) => {
        console.log('Updating estimates cache, removing id:', id);
        if (!oldData) return oldData;
        return oldData.filter((estimate: any) => estimate.id !== id);
      });

      // Also invalidate the queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['estimates'] });
      queryClient.invalidateQueries({ queryKey: ['estimate', id] });
      
      toast({
        title: "Estimate deleted",
        description: "The estimate has been successfully deleted",
      });
      
      console.log('Cache updated and queries invalidated');
    },
    onError: (error) => {
      console.error('Error in deletion mutation:', error);
      toast({
        title: "Error",
        description: "Failed to delete the estimate. Please try again.",
        variant: "destructive",
      });
    },
  });
};