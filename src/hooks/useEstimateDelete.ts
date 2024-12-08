import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

export const useEstimateDelete = (id: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
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
};