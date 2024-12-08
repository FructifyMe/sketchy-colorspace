import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface BusinessSettings {
  company_name: string;
  company_logo: string;
  company_header: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  email: string;
}

export const useBusinessSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<BusinessSettings>({
    company_name: '',
    company_logo: '',
    company_header: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    phone: '',
    email: '',
  });

  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['businessSettings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      console.log("Fetching business settings for user:", user.id);

      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      console.log("Fetched business settings:", data);
      return data as BusinessSettings | null;
    }
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        company_name: settings.company_name || '',
        company_logo: settings.company_logo || '',
        company_header: settings.company_header || '',
        address: settings.address || '',
        city: settings.city || '',
        state: settings.state || '',
        zip_code: settings.zip_code || '',
        phone: settings.phone || '',
        email: settings.email || '',
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      console.log("Submitting business settings:", { ...formData, user_id: user.id });

      // First try to get existing settings
      const { data: existingSettings } = await supabase
        .from('business_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log("Existing settings:", existingSettings);

      let error;
      if (existingSettings) {
        // Update existing settings
        const { error: updateError } = await supabase
          .from('business_settings')
          .update(formData)
          .eq('user_id', user.id);
        error = updateError;
      } else {
        // Insert new settings
        const { error: insertError } = await supabase
          .from('business_settings')
          .insert({
            user_id: user.id,
            ...formData
          });
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: "Business settings updated successfully",
      });
    } catch (error) {
      console.error("Error updating business settings:", error);
      toast({
        title: "Error",
        description: "Failed to update business settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (field: keyof BusinessSettings, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    isLoading,
    isLoadingSettings,
    handleSubmit,
    handleFieldChange,
  };
};