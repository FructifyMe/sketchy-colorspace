import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type TemplateType = Database['public']['Enums']['template_type'];

interface TemplateFormData {
  name: string;
  description: string;
  type: TemplateType;
  template_data: {
    sections: {
      name: string;
      fields: string[];
    }[];
  };
}

export const useTemplateForm = (onSuccess: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<TemplateFormData>({
    name: "",
    description: "",
    type: "estimate",
    template_data: {
      sections: [
        {
          name: "Details",
          fields: ["description", "quantity", "price"]
        }
      ]
    }
  });

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Submitting template:", { ...formData, user_id: userId });

    try {
      const { error } = await supabase
        .from('templates')
        .insert([{
          ...formData,
          user_id: userId
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Template created successfully",
      });
      
      await queryClient.invalidateQueries({ queryKey: ['templates'] });
      onSuccess();
    } catch (error) {
      console.error("Error creating template:", error);
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    isLoading,
    handleSubmit
  };
};