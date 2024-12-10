import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { EstimateData } from '@/types/estimate';
import { estimateService, EstimateServiceError } from '@/services/estimateService';

export const useEstimateFormSubmit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: EstimateData) => {
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Authentication required");
      }

      await estimateService.createEstimate(formData, user.id);
      
      toast({
        title: "Success",
        description: "Estimate saved successfully",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error("Error saving estimate:", error);
      
      const errorMessage = error instanceof EstimateServiceError
        ? error.message
        : "Failed to save estimate. Please try again.";
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
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