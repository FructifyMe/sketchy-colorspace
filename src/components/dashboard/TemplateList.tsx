import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TemplateCard from "./TemplateCard";
import type { Database } from "@/integrations/supabase/types";

type Template = Database['public']['Tables']['templates']['Row'] & {
  template_data: {
    sections: {
      name: string;
      fields: string[];
    }[];
  };
};

interface TemplateListProps {
  templates: Template[] | undefined;
  isLoading: boolean;
  onSelect: (template: Template) => void;
  onDelete: (template: Template) => void;
  onEdit: (template: Template) => void;
  onCreateNew: () => void;
}

const LoadingState = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const EmptyState = ({ onCreateNew }: { onCreateNew: () => void }) => (
  <div className="text-center py-12">
    <h3 className="text-lg font-semibold">No templates yet</h3>
    <p className="text-muted-foreground mt-2">
      Create your first template to get started
    </p>
    <Button onClick={onCreateNew} className="mt-4 gap-2">
      <Plus className="h-4 w-4" />
      Create Template
    </Button>
  </div>
);

const TemplateList = ({ 
  templates, 
  isLoading, 
  onSelect, 
  onDelete, 
  onEdit,
  onCreateNew 
}: TemplateListProps) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!templates?.length) {
    return <EmptyState onCreateNew={onCreateNew} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onSelect={onSelect}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default TemplateList;