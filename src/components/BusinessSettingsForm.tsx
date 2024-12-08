import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface BusinessSettings {
  company_name: string;
  company_logo: string;
  company_header: string;
}

const BusinessSettingsForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['businessSettings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as BusinessSettings | null;
    }
  });

  const [formData, setFormData] = useState<BusinessSettings>({
    company_name: settings?.company_name || '',
    company_logo: settings?.company_logo || '',
    company_header: settings?.company_header || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from('business_settings')
        .upsert({
          user_id: user.id,
          ...formData
        });

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

  if (isLoadingSettings) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Company Name</label>
        <Input
          value={formData.company_name}
          onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
          placeholder="Enter company name"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Company Logo URL</label>
        <Input
          value={formData.company_logo}
          onChange={(e) => setFormData(prev => ({ ...prev, company_logo: e.target.value }))}
          placeholder="Enter logo URL"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Company Header</label>
        <Input
          value={formData.company_header}
          onChange={(e) => setFormData(prev => ({ ...prev, company_header: e.target.value }))}
          placeholder="Enter company header"
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  );
};

export default BusinessSettingsForm;