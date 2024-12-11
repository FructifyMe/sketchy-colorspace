import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EstimateClientInfo from './EstimateClientInfo';
import EstimateItemsSection from './EstimateItemsSection';
import EstimateHeader from './EstimateHeader';
import EstimatePrintHeader from './EstimatePrintHeader';
import EstimateAdditionalDetails from './EstimateAdditionalDetails';
import { useEstimateOperations } from '@/hooks/useEstimateOperations';
import type { Estimate } from '@/types/estimateDetail';
import { parseClientInfo, parseItems } from '@/types/estimateDetail';

const EstimateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const { deleteMutation, updateMutation, handleUpdateItem, handleRemoveItem, handleAddItem } = useEstimateOperations(id!);

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

      // Fetch business settings
      const { data: businessSettings, error: businessError } = await supabase
        .from('business_settings')
        .select('*')
        .eq('user_id', estimateData.user_id)
        .single();

      if (businessError) {
        console.warn('Could not fetch business settings:', businessError);
      }

      return {
        ...estimateData,
        business_settings: businessSettings || {},
        client_info: estimateData.client_info || {},
        items: estimateData.items || []
      };
    },
  });

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

  const handleUpdateClientInfo = (updates: ClientInfo) => {
    if (!estimate) return;
    
    updateMutation.mutate({
      ...estimate,
      client_info: updates
    });
  };

  const handleDelete = async () => {
    console.log('EstimateDetail: handleDelete called');
    try {
      console.log('EstimateDetail: Starting delete mutation');
      await deleteMutation.mutateAsync();
      console.log('EstimateDetail: Delete mutation completed successfully');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error deleting estimate:', error);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

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
    <div className="container mx-auto py-6 px-4 print:p-2">
      <div className="print:hidden">
        <EstimateHeader
          isEditing={isEditing}
          onToggleEdit={() => setIsEditing(!isEditing)}
          onDelete={handleDelete}
          onNavigateBack={() => navigate('/dashboard', { replace: true })}
          estimateId={estimate.id}
        />
      </div>

      <div id="estimate-content" className="space-y-8 print:space-y-2">
        <EstimatePrintHeader 
          businessSettings={estimate?.business_settings}
          estimateNumber={estimate?.id}
          estimateDate={estimate?.created_at}
        />

        <div className="space-y-8 print:space-y-2">
          <EstimateClientInfo
            clientInfo={estimate?.client_info}
            isEditing={isEditing}
            onUpdateClientInfo={handleUpdateClientInfo}
          />

          <div className="space-y-8 print:space-y-2">
            <h2 className="text-3xl font-semibold mb-3 text-left print:text-lg print:mb-2">Estimate</h2>

            <Card className="print:shadow-none print:border-none">
              <CardHeader className="py-3 print:py-1">
                <CardTitle className="text-left text-xl print:text-base">Description</CardTitle>
              </CardHeader>
              <CardContent className="py-3 print:py-1">
                <div className="text-left whitespace-pre-wrap text-lg print:text-xs">
                  {estimate.description?.split('\n').map((line, index) => (
                    line.trim() && (
                      <div key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{line.trim()}</span>
                      </div>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>

            <EstimateItemsSection
              items={estimate.items}
              isEditing={isEditing}
              onUpdateItem={(index, item) => handleUpdateItem(estimate, index, item)}
              onRemoveItem={(index) => handleRemoveItem(estimate, index)}
              onAddItem={() => handleAddItem(estimate)}
            />
          </div>
        </div>

        <EstimateAdditionalDetails
          terms={estimate.terms_and_conditions}
          paymentPolicy={estimate.payment_policy}
          notes={estimate.notes}
          showTerms={estimate.show_terms}
          showPaymentPolicy={estimate.show_payment_policy}
          expirationDate={estimate.expiration_date}
          isEditing={isEditing}
          onUpdate={handleUpdateDetails}
        />
      </div>
    </div>
  );
};

export default EstimateDetail;