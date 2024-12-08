import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";
import CreateTemplateDialog from "@/components/CreateTemplateDialog";
import BusinessSettingsForm from "@/components/BusinessSettingsForm";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TemplateList from "@/components/dashboard/TemplateList";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

type Template = Database['public']['Tables']['templates']['Row'] & {
  template_data: {
    sections: {
      name: string;
      fields: string[];
    }[];
  };
};

type Estimate = Database['public']['Tables']['estimates']['Row'];

const DashboardPage = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
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
      return data as Estimate[];
    },
    // Add staleTime to prevent unnecessary refetches
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
      
      // Invalidate templates query to refresh the list
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

      <Card>
        <CardHeader>
          <CardTitle>Recent Estimates</CardTitle>
          <CardDescription>View and manage your estimates</CardDescription>
        </CardHeader>
        <CardContent>
          {estimatesLoading ? (
            <div>Loading estimates...</div>
          ) : estimates && estimates.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estimates.map((estimate) => (
                  <TableRow 
                    key={estimate.id}
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => navigate(`/estimates/${estimate.id}`)}
                  >
                    <TableCell>{estimate.description || 'No description'}</TableCell>
                    <TableCell>
                      {estimate.client_info ? 
                        (estimate.client_info as any).name || 'No client name' 
                        : 'No client info'}
                    </TableCell>
                    <TableCell className="capitalize">{estimate.status}</TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(estimate.created_at), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No estimates found. Create your first estimate to get started.
            </div>
          )}
        </CardContent>
      </Card>

      <TemplateList
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
