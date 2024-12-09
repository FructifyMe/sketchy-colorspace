import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";
import CreateTemplateDialog from "@/components/CreateTemplateDialog";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import RecentEstimates from "@/components/dashboard/RecentEstimates";
import DashboardTemplates from "@/components/dashboard/DashboardTemplates";
import BusinessSettingsCard from "@/components/dashboard/BusinessSettingsCard";

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
  const queryClient = useQueryClient();
  
  const { data: templates, isLoading: templatesLoading, error: templatesError } = useQuery({
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

  const { data: estimates, isLoading: estimatesLoading } = useQuery({
    queryKey: ['estimates'],
    queryFn: async () => {
      console.log("Fetching estimates for dashboard");
      const { data, error } = await supabase
        .from('estimates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching estimates:", error);
        throw error;
      }

      console.log("Fetched estimates:", data);
      return data as Database['public']['Tables']['estimates']['Row'][];
    },
    staleTime: 1000,
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
      
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    } catch (error) {
      console.error("Error deleting template:", error);
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      });
    }
  };

  if (templatesError) {
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

      {showSettings && <BusinessSettingsCard />}

      <RecentEstimates 
        estimates={estimates} 
        isLoading={estimatesLoading} 
      />

      <DashboardTemplates
        templates={templates}
        isLoading={templatesLoading}
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