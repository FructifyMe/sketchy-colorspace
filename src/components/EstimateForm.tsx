import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import VoiceRecorder from './VoiceRecorder';
import { useToast } from "@/components/ui/use-toast";
import ClientInfoForm from './estimates/ClientInfoForm';
import EstimateItems from './estimates/EstimateItems';
import EstimateDescription from './estimates/EstimateDescription';
import type { EstimateItem, EstimateClientInfo } from '@/types/estimateDetail';
import { useEstimateFormSubmit } from '@/hooks/useEstimateFormSubmit';

const EstimateForm: React.FC = () => {
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
    } as EstimateClientInfo
  });

  const handleTranscriptionComplete = (data: any) => {
    console.log("Received transcription data:", data);
    
    const mappedItems = Array.isArray(data.items) ? data.items.map(item => ({
      name: item.description || item.name || '',
      quantity: item.quantity || 1,
      price: item.unitPrice || item.price || 0
    })) : [];

    console.log("Mapped items:", mappedItems);
    
    setFormData(prev => ({
      description: data.description || '',
      items: mappedItems,
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
      description: "Your estimate has been populated with the transcribed data",
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      
      <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />
      
      <form onSubmit={onSubmit} className="space-y-6 mt-6">
        <Card className="p-4">
          <div className="space-y-4">
            <ClientInfoForm
              clientInfo={formData.clientInfo}
              onChange={(info) => setFormData(prev => ({ ...prev, clientInfo: info }))}
            />

            <EstimateDescription
              description={formData.description}
              onChange={(description) => setFormData(prev => ({ ...prev, description }))}
            />

            <EstimateItems items={formData.items} />
          </div>
        </Card>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Estimate'}
        </Button>
      </form>
    </div>
  );
};

export default EstimateForm;