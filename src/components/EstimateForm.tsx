import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import VoiceRecorder from './VoiceRecorder';
import ClientInfoForm from './estimates/ClientInfoForm';
import EstimateItems from './estimates/EstimateItems';
import EstimateDescription from './estimates/EstimateDescription';
import EstimateFormActions from './estimates/EstimateFormActions';
import { supabase } from "@/integrations/supabase/client";
import type { ClientInfo } from '@/types/estimate';
import type { Json } from '@/integrations/supabase/types';

const EstimateForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    description: '',
    items: [] as Array<{ name: string; quantity?: number; price?: number }>,
    clientInfo: {
      name: '',
      address: '',
      phone: '',
      email: ''
    } as ClientInfo
  });

  const handleTranscriptionComplete = (data: any) => {
    console.log("Received transcription data:", data);
    
    const mappedItems = Array.isArray(data.items) ? data.items.map(item => ({
      name: item.description || '',
      quantity: item.quantity || 1,
      price: item.unitPrice || item.price || 0
    })) : [];

    console.log("Mapped items:", mappedItems);
    
    setFormData(prev => ({
      ...prev,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      console.log("Saving estimate:", formData);
      
      const { data, error } = await supabase
        .from('estimates')
        .insert({
          user_id: user.id,
          description: formData.description,
          items: formData.items as unknown as Json,
          client_info: formData.clientInfo as unknown as Json,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      console.log("Estimate saved successfully:", data);
      
      toast({
        title: "Success",
        description: "Estimate saved successfully",
      });

      navigate(`/estimates/${data.id}`);
    } catch (error) {
      console.error("Error saving estimate:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save estimate. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <EstimateFormActions isSubmitting={isSubmitting} />
        
        <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />
        
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
      </form>
    </div>
  );
};

export default EstimateForm;