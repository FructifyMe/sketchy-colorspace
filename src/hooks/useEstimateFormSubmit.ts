import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { EstimateData } from '@/types/estimate';
import { toSupabaseJson } from '@/types/estimate';

export const useEstimateFormSubmit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: EstimateData) => {
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      console.log("Saving estimate:", formData);
      
      const { data, error } = await supabase
        .from('estimates')
        .insert({
          user_id: user.id,
          description: formData.description,
          items: toSupabaseJson(formData.items),
          client_info: toSupabaseJson(formData.clientInfo),
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      console.log("Estimate saved successfully:", data);
      
      toast({
        title: "Success",
        description: "Estimate saved successfully",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error("Error saving estimate:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save estimate. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
};