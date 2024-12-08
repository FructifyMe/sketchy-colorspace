import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Mail, Download, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EstimateActionsProps {
  estimateId: string;
  onPrint: () => void;
  onEmail: () => void;
  onDownload: () => void;
}

const EstimateActions = ({ estimateId, onPrint, onEmail, onDownload }: EstimateActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-8 print:hidden">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate(`/estimates/${estimateId}/edit`)}
          className="flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onPrint}
          className="flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          Print
        </Button>
        <Button
          variant="outline"
          onClick={onEmail}
          className="flex items-center gap-2"
        >
          <Mail className="w-4 h-4" />
          Email
        </Button>
        <Button
          variant="outline"
          onClick={onDownload}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
      </div>
    </div>
  );
};

export default EstimateActions;