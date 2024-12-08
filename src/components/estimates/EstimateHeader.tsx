import { Button } from "@/components/ui/button";
import { FileDown, Printer } from "lucide-react";
import EmailEstimateDialog from "./EmailEstimateDialog";
import DeleteEstimateDialog from "./DeleteEstimateDialog";

interface EstimateHeaderProps {
  isEditing: boolean;
  onToggleEdit: () => void;
  onDelete: () => void;
  onNavigateBack: () => void;
  estimateId: string;
  onDownloadPDF: () => void;
}

const EstimateHeader = ({ 
  isEditing, 
  onToggleEdit, 
  onDelete, 
  onNavigateBack,
  estimateId,
  onDownloadPDF
}: EstimateHeaderProps) => {
  const handlePrint = () => {
    console.log('Printing estimate...');
    window.print();
  };

  return (
    <div className="flex items-center justify-between mb-6 print:hidden">
      <h2 className="text-2xl font-bold">Estimate Details</h2>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onNavigateBack}>
          Back to Dashboard
        </Button>

        <Button
          variant="outline"
          onClick={handlePrint}
        >
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>

        <Button
          variant="outline"
          onClick={onDownloadPDF}
        >
          <FileDown className="h-4 w-4 mr-2" />
          Save PDF
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