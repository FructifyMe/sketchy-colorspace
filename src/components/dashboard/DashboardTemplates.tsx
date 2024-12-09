import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TemplateList from "./TemplateList";
import type { Database } from "@/integrations/supabase/types";

type Template = Database['public']['Tables']['templates']['Row'] & {
  template_data: {
    sections: {
      name: string;
      fields: string[];
    }[];
  };
};

interface DashboardTemplatesProps {
  templates: Template[] | undefined;
  isLoading: boolean;
  onSelect: (template: Template) => void;
  onDelete: (template: Template) => void;
  onEdit: (template: Template) => void;
  onCreateNew: () => void;
}

const DashboardTemplates = ({
  templates,
  isLoading,
  onSelect,
  onDelete,
  onEdit,
  onCreateNew
}: DashboardTemplatesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Templates</CardTitle>
        <CardDescription>Manage your estimate templates</CardDescription>
      </CardHeader>
      <CardContent>
        <TemplateList
          templates={templates}
          isLoading={isLoading}
          onSelect={onSelect}
          onDelete={onDelete}
          onEdit={onEdit}
          onCreateNew={onCreateNew}
        />
      </CardContent>
    </Card>
  );
};

export default DashboardTemplates;