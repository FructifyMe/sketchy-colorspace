import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, FileEdit, Trash2, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Database } from "@/integrations/supabase/types";
import CreateTemplateDialog from "@/components/CreateTemplateDialog";
import BusinessSettingsForm from "@/components/BusinessSettingsForm";

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Templates</h1>
          <p className="text-muted-foreground mt-2">
            Manage and create new templates for your estimates
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => setShowSettings(!showSettings)} variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Business Settings
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Template
          </Button>
        </div>
      </div>

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

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : templates?.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold">No templates yet</h3>
          <p className="text-muted-foreground mt-2">
            Create your first template to get started
          </p>
          <Button onClick={() => setCreateDialogOpen(true)} className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Create Template
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates?.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => console.log("Edit template:", template)}
                    >
                      <FileEdit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTemplate(template)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    {template.template_data.sections.length} sections
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateTemplateDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
      />
    </div>
  );
};

export default DashboardPage;