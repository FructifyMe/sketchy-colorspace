import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { useEstimateOperations } from '@/hooks/useEstimateOperations';
import type { Estimate, EstimateItem } from '@/types/estimateDetail';
import { parseClientInfo, parseItems } from '@/types/estimateDetail';
import html2pdf from 'html2pdf.js';
import EstimateActions from './EstimateActions';
import EstimateContent from './EstimateContent';

const EstimateDetail = () => {
  const { id } = useParams();
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
    console.log('Updating estimate details:', updates);
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
        .select(`
          *,
          business_settings!inner (
            company_name,
            company_logo,
            company_header,
            address,
            city,
            state,
            zip_code,
            phone,
            email
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (estimateError) throw estimateError;
      if (!estimateData) throw new Error('Estimate not found');

      console.log('Fetched estimate data:', estimateData);

      return {
        ...estimateData,
        client_info: parseClientInfo(estimateData.client_info),
        items: parseItems(estimateData.items),
        status: estimateData.status || 'draft',
        notes: estimateData.notes,
        business_settings: estimateData.business_settings || {
          company_name: null,
          company_logo: null,
          company_header: null,
          address: null,
          city: null,
          state: null,
          zip_code: null,
          phone: null,
          email: null,
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
      <EstimateActions
        estimate={estimate}
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(!isEditing)}
        onDelete={() => deleteMutation.mutate()}
        onDownloadPDF={handleDownloadPDF}
      />

      <div id="estimate-content">
        <EstimateContent
          estimate={estimate}
          isEditing={isEditing}
          onUpdateItem={handleUpdateItem}
          onRemoveItem={handleRemoveItem}
          onAddItem={handleAddItem}
          onUpdateDetails={handleUpdateDetails}
        />
      </div>
    </div>
  );
};

export default EstimateDetail;