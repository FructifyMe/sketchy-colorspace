import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CompanyLogoUploadProps {
  currentLogo: string;
  onLogoUpdate: (url: string) => void;
}

const CompanyLogoUpload = ({ currentLogo, onLogoUpdate }: CompanyLogoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

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

      onLogoUpdate(publicUrl);
      
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

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Company Logo</label>
      <div className="flex items-end gap-4">
        {currentLogo && (
          <img 
            src={currentLogo} 
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
  );
};

export default CompanyLogoUpload;