import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Template = Database['public']['Tables']['templates']['Row'] & {
  template_data: {
    sections: {
      name: string;
      fields: string[];
    }[];
  };
};

const DashboardPage = () => {
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
      
      // Assert the template_data structure
      const typedData = data?.map(template => ({
        ...template,
        template_data: template.template_data as Template['template_data']
      }));
      
      return typedData as Template[];
    }
  });

  const handleTemplateSelect = (template: Template) => {
    console.log("Selected template:", template);
    toast({
      title: "Template selected",
      description: `You selected the ${template.name} template`,
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading templates...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading templates</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Templates</h1>
        <p className="text-gray-600 mt-2">Select a template to create a new estimate</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates?.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
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
    </div>
  );
};

export default DashboardPage;