import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import EstimateClientInfo from './EstimateClientInfo';
import EstimateItemsSection from './EstimateItemsSection';
import EstimateHeader from './EstimateHeader';
import EstimatePrintHeader from './EstimatePrintHeader';
import EstimateStatus from './EstimateStatus';
import EstimateAdditionalDetails from './EstimateAdditionalDetails';
import EstimateDescription from './EstimateDescription';
import EstimateSignature from './EstimateSignature';
import EstimateNotes from './EstimateNotes';
import { useEstimateOperations } from '@/hooks/useEstimateOperations';
import type { Estimate } from '@/types/estimateDetail';
import { parseClientInfo, parseItems } from '@/types/estimateDetail';
import html2pdf from 'html2pdf.js';

const EstimateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const { deleteMutation, updateMutation, handleUpdateItem: baseHandleUpdateItem, handleRemoveItem: baseHandleRemoveItem, handleAddItem: baseHandleAddItem } = useEstimateOperations(id!);

  const handleUpdateItem = (index: number, item: EstimateItem) => {
    if (!estimate) return;
    baseHandleUpdateItem(estimate, index, item);
  };

  const handleRemoveItem = (index: number) => {
    if (!estimate) return;
    baseHandleRemoveItem(estimate, index);
  };

  const handleAddItem = () => {
    if (!estimate) return;
    baseHandleAddItem(estimate);
  };

  const handleDownloadPDF = () => {
    console.log('Downloading PDF...');
    const element = document.getElementById('estimate-content');
    if (!element) return;
    
    const opt = {
      margin: 1,
      filename: 'estimate.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  const handleUpdateDetails = (updates: {
    terms?: string;
    paymentPolicy?: string;
    notes?: string;
    showTerms?: boolean;
    showPaymentPolicy?: boolean;
  }) => {
    if (!estimate) return;
    updateMutation.mutate({
      ...estimate,
      terms_and_conditions: updates.terms ?? estimate.terms_and_conditions,
      payment_policy: updates.paymentPolicy ?? estimate.payment_policy,
      notes: updates.notes ?? estimate.notes,
      show_terms: updates.showTerms ?? estimate.show_terms,
      show_payment_policy: updates.showPaymentPolicy ?? estimate.show_payment_policy,
    });
  };

  const { data: estimate, isLoading, error } = useQuery({
    queryKey: ['estimate', id],
    queryFn: async () => {
      console.log('Fetching estimate:', id);
      const { data: estimateData, error: estimateError } = await supabase
        .from('estimates')
        .select('*')
        .eq('id', id)
        .single();

      if (estimateError) throw estimateError;
      if (!estimateData) throw new Error('Estimate not found');

      const { data: businessSettingsData, error: businessSettingsError } = await supabase
        .from('business_settings')
        .select('*')
        .eq('user_id', estimateData.user_id)
        .single();

      if (businessSettingsError) throw businessSettingsError;
      if (!businessSettingsData) throw new Error('Business settings not found');

      return {
        ...estimateData,
        client_info: parseClientInfo(estimateData.client_info),
        items: parseItems(estimateData.items),
        status: estimateData.status || 'draft',
        business_settings: {
          company_name: businessSettingsData.company_name || null,
          company_logo: businessSettingsData.company_logo || null,
          company_header: businessSettingsData.company_header || null,
          address: businessSettingsData.address || null,
          city: businessSettingsData.city || null,
          state: businessSettingsData.state || null,
          zip_code: businessSettingsData.zip_code || null,
          phone: businessSettingsData.phone || null,
          email: businessSettingsData.email || null,
        },
      };
    }
  });

  if (isLoading) return <div className="container mx-auto p-6">Loading...</div>;
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="rounded-lg bg-destructive/15 p-4 text-destructive">
          {error instanceof Error ? error.message : 'Error loading estimate'}
        </div>
      </div>
    );
  }
  if (!estimate) {
    return (
      <div className="container mx-auto p-6">
        <div className="rounded-lg bg-destructive/15 p-4 text-destructive">
          Estimate not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <EstimateHeader
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(!isEditing)}
        onDelete={() => deleteMutation.mutate()}
        onNavigateBack={() => navigate('/dashboard')}
        estimateId={estimate.id}
        onDownloadPDF={handleDownloadPDF}
      />

      <div id="estimate-content" className="space-y-6 print:space-y-4 print:p-6">
        <EstimatePrintHeader businessSettings={estimate.business_settings} />
        <EstimateClientInfo clientInfo={estimate.client_info} />
        <EstimateDescription description={estimate.description} />
        <EstimateItemsSection
          items={estimate.items}
          isEditing={isEditing}
          onUpdateItem={handleUpdateItem}
          onRemoveItem={handleRemoveItem}
          onAddItem={handleAddItem}
        />
        <EstimateStatus 
          status={estimate.status} 
          createdAt={estimate.created_at} 
        />
        <EstimateNotes
          notes={estimate.notes}
          isEditing={isEditing}
          onUpdate={(notes) => handleUpdateDetails({ notes })}
        />
        <EstimateAdditionalDetails
          terms={estimate.terms_and_conditions}
          paymentPolicy={estimate.payment_policy}
          showTerms={estimate.show_terms}
          showPaymentPolicy={estimate.show_payment_policy}
          expirationDate={estimate.expiration_date}
          isEditing={isEditing}
          onUpdate={handleUpdateDetails}
        />
        <EstimateSignature />
      </div>
    </div>
  );
};

export default EstimateDetail;
