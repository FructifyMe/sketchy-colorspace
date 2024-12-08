import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";
import CreateTemplateDialog from "@/components/CreateTemplateDialog";
import BusinessSettingsForm from "@/components/BusinessSettingsForm";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TemplateList from "@/components/dashboard/TemplateList";

type Template = Database['public']['Tables']['templates']['Row'] & {
  template_data: {
    sections: {
      name: string;
      fields: string[];
    }[];
  };
};

const DashboardPage = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();
  
  const { data: templates, isLoading, error } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching templates:", error);
        throw error;
      }
      
      return data as Template[];
    }
  });

  const handleTemplateSelect = (template: Template) => {
    console.log("Selected template:", template);
    toast({
      title: "Template selected",
      description: `You selected the ${template.name} template`,
    });
  };

  const handleDeleteTemplate = async (template: Template) => {
    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', template.id);

      if (error) throw error;

      toast({
        title: "Template deleted",
        description: `Successfully deleted ${template.name}`,
      });
    } catch (error) {
      console.error("Error deleting template:", error);
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="rounded-lg bg-destructive/15 p-4 text-destructive">
          Error loading templates. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <DashboardHeader
        onCreateTemplate={() => setCreateDialogOpen(true)}
        onToggleSettings={() => setShowSettings(!showSettings)}
      />

      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle>Business Settings</CardTitle>
            <CardDescription>
              Manage your company information that will appear on all templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BusinessSettingsForm />
          </CardContent>
        </Card>
      )}

      <TemplateList
        templates={templates}
        isLoading={isLoading}
        onSelect={handleTemplateSelect}
        onDelete={handleDeleteTemplate}
        onEdit={(template) => console.log("Edit template:", template)}
        onCreateNew={() => setCreateDialogOpen(true)}
      />

      <CreateTemplateDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
      />
    </div>
  );
};

export default DashboardPage;