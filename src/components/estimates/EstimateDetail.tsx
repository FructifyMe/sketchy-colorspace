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
import html2pdf from 'html2pdf.js';

const EstimateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const { deleteMutation, handleUpdateItem, handleRemoveItem, handleAddItem } = useEstimateOperations(id!);

  const handleDownloadPDF = () => {
    console.log('Downloading PDF directly...');
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

  const { data: estimate, isLoading, error } = useQuery({
    queryKey: ['estimate', id],
    queryFn: async () => {
      console.log('Fetching estimate:', id);
      
      // First, fetch the estimate
      const { data: estimateData, error: estimateError } = await supabase
        .from('estimates')
        .select('*')
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

      // Then, fetch the business settings
      const { data: businessSettingsData, error: businessSettingsError } = await supabase
        .from('business_settings')
        .select('*')
        .eq('user_id', estimateData.user_id)
        .single();

      if (businessSettingsError) {
        console.error("Error fetching business settings:", businessSettingsError);
        throw businessSettingsError;
      }

      if (!businessSettingsData) {
        console.error('No business settings found for user');
        throw new Error('Business settings not found');
      }

      console.log('Business settings data:', businessSettingsData);

      const parsedData: Estimate = {
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
        onDownloadPDF={handleDownloadPDF}
      />

      <div id="estimate-content" className="space-y-6 print:space-y-4">
        <EstimatePrintHeader businessSettings={estimate.business_settings} />

        <EstimateClientInfo clientInfo={estimate.client_info} />

        <h2 className="text-2xl font-semibold mb-4">Estimate</h2>

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