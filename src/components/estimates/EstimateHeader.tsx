import { Button } from "@/components/ui/button";
import EmailEstimateDialog from "./EmailEstimateDialog";
import DeleteEstimateDialog from "./DeleteEstimateDialog";

interface EstimateHeaderProps {
  isEditing: boolean;
  onToggleEdit: () => void;
  onDelete: () => void;
  onNavigateBack: () => void;
  estimateId: string;
}

const EstimateHeader = ({ 
  isEditing, 
  onToggleEdit, 
  onDelete, 
  onNavigateBack,
  estimateId
}: EstimateHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold">Estimate Details</h2>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onNavigateBack}>
          Back to Dashboard
        </Button>

        <EmailEstimateDialog estimateId={estimateId} />

        <Button 
          variant="secondary"
          onClick={onToggleEdit}
        >
          {isEditing ? 'Save' : 'Edit'}
        </Button>

        <DeleteEstimateDialog onDelete={onDelete} />
      </div>
    </div>
  );
};

export default EstimateHeader;