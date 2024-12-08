import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Upload } from "lucide-react";

interface BusinessSettings {
  company_name: string;
  company_logo: string;
  company_header: string;
}

const BusinessSettingsForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['businessSettings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data as BusinessSettings | null;
    }
  });

  const [formData, setFormData] = useState<BusinessSettings>({
    company_name: '',
    company_logo: '',
    company_header: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        company_name: settings.company_name || '',
        company_logo: settings.company_logo || '',
        company_header: settings.company_header || '',
      });
    }
  }, [settings]);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('company_logos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('company_logos')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, company_logo: publicUrl }));
      
      toast({
        title: "Success",
        description: "Logo uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Error",
        description: "Failed to upload logo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      console.log("Submitting business settings:", { ...formData, user_id: user.id });

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
        <label className="text-sm font-medium">Company Logo</label>
        <div className="flex items-end gap-4">
          {formData.company_logo && (
            <img 
              src={formData.company_logo} 
              alt="Company logo" 
              className="h-20 w-20 object-contain rounded-md border"
            />
          )}
          <div className="flex-1">
            <Input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
              id="logo-upload"
              disabled={isUploading}
            />
            <label 
              htmlFor="logo-upload" 
              className="flex items-center gap-2 cursor-pointer w-full px-3 py-2 border rounded-md hover:bg-gray-50"
            >
              <Upload className="h-4 w-4" />
              <span>{isUploading ? "Uploading..." : "Upload Logo"}</span>
            </label>
          </div>
        </div>
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