import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ClientInfoForm from './ClientInfoForm';
import EstimateDescription from './EstimateDescription';
import EstimateItems from './EstimateItems';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { EstimateItem, EstimateClientInfo } from '@/types/estimateDetail';

interface EstimateFormSectionProps {
  formData: {
    description: string;
    items: EstimateItem[];
    clientInfo: EstimateClientInfo;
    notes: string;
  };
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onFormDataChange: (updates: Partial<{
    description: string;
    items: EstimateItem[];
    clientInfo: EstimateClientInfo;
    notes: string;
  }>) => void;
}

const EstimateFormSection = ({ 
  formData, 
  isSubmitting, 
  onSubmit,
  onFormDataChange 
}: EstimateFormSectionProps) => {
  if (!formData.description && !formData.items.length && !formData.clientInfo.name) {
    return null;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card className="p-4">
        <div className="space-y-4">
          <ClientInfoForm
            clientInfo={formData.clientInfo}
            onChange={(info) => onFormDataChange({ clientInfo: info })}
          />

          <EstimateDescription
            description={formData.description}
            onChange={(description) => onFormDataChange({ description })}
          />

          <EstimateItems items={formData.items} />

          <div className="space-y-2">
            <Label htmlFor="notes">Notes & Special Instructions</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => onFormDataChange({ notes: e.target.value })}
              placeholder="Enter any special instructions, access details, or additional notes..."
              className="min-h-[100px]"
            />
          </div>
        </div>
      </Card>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Estimate'}
      </Button>
    </form>
  );
};

export default EstimateFormSection;