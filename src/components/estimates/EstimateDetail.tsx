import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EstimateClientInfo from './EstimateClientInfo';
import EstimateItemsSection from './EstimateItemsSection';
import EstimateHeader from './EstimateHeader';
import EstimatePrintHeader from './EstimatePrintHeader';
import EstimateStatus from './EstimateStatus';
import { useEstimateOperations } from '@/hooks/useEstimateOperations';
import type { Estimate } from '@/types/estimateDetail';
import { parseClientInfo, parseItems } from '@/types/estimateDetail';

const EstimateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const { deleteMutation, handleUpdateItem, handleRemoveItem, handleAddItem } = useEstimateOperations(id!);

  const { data: estimate, isLoading, error } = useQuery({
    queryKey: ['estimate', id],
    queryFn: async () => {
      console.log('Fetching estimate:', id);
      const { data: estimateData, error: estimateError } = await supabase
        .from('estimates')
        .select(`
          *,
          business_settings:business_settings(*)
        `)
        .eq('id', id)
        .single();

      if (estimateError) {
        console.error("Error fetching estimate:", estimateError);
        throw estimateError;
      }

      if (!estimateData) {
        throw new Error('Estimate not found');
      }

      console.log('Raw estimate data:', estimateData);

      // Ensure business_settings is properly structured
      const businessSettings = Array.isArray(estimateData.business_settings) 
        ? estimateData.business_settings[0] 
        : estimateData.business_settings;

      if (!businessSettings) {
        console.error('No business settings found for estimate');
        throw new Error('Business settings not found');
      }

      const parsedData: Estimate = {
        ...estimateData,
        client_info: parseClientInfo(estimateData.client_info),
        items: parseItems(estimateData.items),
        status: estimateData.status || 'draft',
        business_settings: {
          company_name: businessSettings.company_name || null,
          company_logo: businessSettings.company_logo || null,
          company_header: businessSettings.company_header || null,
          address: businessSettings.address || null,
          city: businessSettings.city || null,
          state: businessSettings.state || null,
          zip_code: businessSettings.zip_code || null,
          phone: businessSettings.phone || null,
          email: businessSettings.email || null,
        },
      };

      console.log('Parsed estimate data:', parsedData);
      return parsedData;
    }
  });

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
    <div className="container mx-auto p-6">
      <EstimateHeader
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(!isEditing)}
        onDelete={() => deleteMutation.mutate()}
        onNavigateBack={() => navigate('/dashboard')}
        estimateId={estimate.id}
      />

      <div className="space-y-6 print:space-y-4">
        <EstimatePrintHeader businessSettings={estimate.business_settings} />

        <EstimateClientInfo clientInfo={estimate.client_info} />

        <Card className="print:shadow-none print:border-none">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{estimate.description || 'No description provided'}</p>
          </CardContent>
        </Card>

        <EstimateItemsSection
          items={estimate.items}
          isEditing={isEditing}
          onUpdateItem={(index, item) => handleUpdateItem(estimate, index, item)}
          onRemoveItem={(index) => handleRemoveItem(estimate, index)}
          onAddItem={() => handleAddItem(estimate)}
        />

        <EstimateStatus 
          status={estimate.status} 
          createdAt={estimate.created_at} 
        />
      </div>
    </div>
  );
};

export default EstimateDetail;