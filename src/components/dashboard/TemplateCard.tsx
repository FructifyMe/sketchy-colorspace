import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileEdit, Trash2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Template = Database['public']['Tables']['templates']['Row'] & {
  template_data: {
    sections: {
      name: string;
      fields: string[];
    }[];
  };
};

interface TemplateCardProps {
  template: Template;
  onSelect: (template: Template) => void;
  onDelete: (template: Template) => void;
  onEdit: (template: Template) => void;
}

const TemplateCard = ({ template, onSelect, onDelete, onEdit }: TemplateCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow group">
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
              onClick={() => onEdit(template)}
            >
              <FileEdit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(template)}
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
            onClick={() => onSelect(template)}
          >
            Use Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;