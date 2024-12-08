import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
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

const TemplateCard = ({ template, onDelete, onEdit }: TemplateCardProps) => {
  const navigate = useNavigate();

  const handleUseTemplate = () => {
    console.log("Navigating to estimate form with template:", template);
    navigate('/estimates/new', { state: { template } });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{template.name}</h3>
          <p className="text-sm text-muted-foreground">{template.description}</p>
          <div className="flex gap-2">
            <Button 
              onClick={handleUseTemplate}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              Use Template
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onEdit(template)}
            >
              Edit
            </Button>
            <Button 
              variant="destructive"
              onClick={() => onDelete(template)}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;