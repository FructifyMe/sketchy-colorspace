import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Database } from "@/integrations/supabase/types";

type TemplateType = Database['public']['Enums']['template_type'];

interface TemplateFormData {
  name: string;
  description: string;
  type: TemplateType;
  template_data: {
    sections: {
      name: string;
      fields: string[];
    }[];
  };
}

interface TemplateFormFieldsProps {
  formData: TemplateFormData;
  setFormData: (data: TemplateFormData) => void;
}

const TemplateFormFields = ({ formData, setFormData }: TemplateFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter template name"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter template description"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Type</label>
        <Select
          value={formData.type}
          onValueChange={(value: TemplateType) => 
            setFormData({ ...formData, type: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="estimate">Estimate</SelectItem>
            <SelectItem value="invoice">Invoice</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default TemplateFormFields;