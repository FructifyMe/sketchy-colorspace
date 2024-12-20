import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import type { EstimateItem, EstimateClientInfo } from '@/types/estimateDetail';
import { useEstimateFormSubmit } from '@/hooks/useEstimateFormSubmit';
import VoiceRecordingSection from './estimates/VoiceRecordingSection';
import EstimateFormSection from './estimates/EstimateFormSection';

const EstimateForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isSubmitting, handleSubmit } = useEstimateFormSubmit();
  const [formData, setFormData] = useState({
    description: '',
    items: [] as EstimateItem[],
    clientInfo: {
      name: '',
      address: '',
      phone: '',
      email: ''
    } as EstimateClientInfo,
    notes: ''
  });

  const handleTranscriptionComplete = (data: any) => {
    console.log("Received transcription data:", data);
    
    // Map items, ensuring all required fields are present
    const mappedItems = Array.isArray(data.items) ? data.items.map(item => ({
      name: item.description || '',
      quantity: item.quantity || 1,
      price: item.price || 0
    })) : [];

    console.log("Mapped items:", mappedItems);
    
    // Update form data with the processed information
    setFormData(prev => ({
      description: data.description || '',  // This is now the processed description from GPT-4
      items: mappedItems,
      notes: data.notes || '',
      clientInfo: {
        ...prev.clientInfo,
        name: data.clientInfo?.name || '',
        address: data.clientInfo?.address || '',
        phone: data.clientInfo?.phone || '',
        email: data.clientInfo?.email || ''
      }
    }));

    toast({
      title: "Transcription complete",
      description: "Your estimate has been populated with the processed data",
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving estimate:", formData);
    await handleSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create New Estimate</h2>
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
      
      <VoiceRecordingSection onTranscriptionComplete={handleTranscriptionComplete} />
      
      <EstimateFormSection
        formData={formData}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        onFormDataChange={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
      />
    </div>
  );
};

export default EstimateForm;