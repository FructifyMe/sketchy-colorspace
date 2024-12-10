import EstimateClientInfo from './EstimateClientInfo';
import EstimateDescription from './EstimateDescription';
import EstimateItemsSection from './EstimateItemsSection';
import EstimateStatus from './EstimateStatus';
import EstimateNotes from './EstimateNotes';
import EstimateAdditionalDetails from './EstimateAdditionalDetails';
import EstimateSignature from './EstimateSignature';
import EstimatePrintHeader from './EstimatePrintHeader';
import type { Estimate, EstimateItem } from '@/types/estimateDetail';

interface EstimateContentProps {
  estimate: Estimate;
  isEditing: boolean;
  onUpdateItem: (index: number, item: EstimateItem) => void;
  onRemoveItem: (index: number) => void;
  onAddItem: () => void;
  onUpdateDetails: (updates: {
    terms?: string;
    paymentPolicy?: string;
    notes?: string;
    showTerms?: boolean;
    showPaymentPolicy?: boolean;
  }) => void;
}

const EstimateContent = ({
  estimate,
  isEditing,
  onUpdateItem,
  onRemoveItem,
  onAddItem,
  onUpdateDetails,
}: EstimateContentProps) => {
  return (
    <div className="space-y-6 print:space-y-4 print:p-6">
      <EstimatePrintHeader businessSettings={estimate.business_settings} />
      <EstimateClientInfo clientInfo={estimate.client_info} />
      <EstimateDescription description={estimate.description} />
      <EstimateItemsSection
        items={estimate.items}
        isEditing={isEditing}
        onUpdateItem={onUpdateItem}
        onRemoveItem={onRemoveItem}
        onAddItem={onAddItem}
      />
      <EstimateStatus 
        status={estimate.status} 
        createdAt={estimate.created_at} 
      />
      <EstimateNotes
        notes={estimate.notes}
        isEditing={isEditing}
        onUpdate={(notes) => onUpdateDetails({ notes })}
      />
      <EstimateAdditionalDetails
        terms={estimate.terms_and_conditions}
        paymentPolicy={estimate.payment_policy}
        showTerms={estimate.show_terms}
        showPaymentPolicy={estimate.show_payment_policy}
        expirationDate={estimate.expiration_date}
        isEditing={isEditing}
        onUpdate={onUpdateDetails}
      />
      <EstimateSignature />
    </div>
  );
};

export default EstimateContent;