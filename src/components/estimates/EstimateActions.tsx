import { useNavigate } from 'react-router-dom';
import EstimateHeader from './EstimateHeader';
import type { Estimate } from '@/types/estimateDetail';

interface EstimateActionsProps {
  estimate: Estimate;
  isEditing: boolean;
  onToggleEdit: () => void;
  onDelete: () => void;
  onDownloadPDF: () => void;
}

const EstimateActions = ({
  estimate,
  isEditing,
  onToggleEdit,
  onDelete,
  onDownloadPDF
}: EstimateActionsProps) => {
  const navigate = useNavigate();

  return (
    <EstimateHeader
      isEditing={isEditing}
      onToggleEdit={onToggleEdit}
      onDelete={onDelete}
      onNavigateBack={() => navigate('/dashboard')}
      estimateId={estimate.id}
      onDownloadPDF={onDownloadPDF}
    />
  );
};

export default EstimateActions;