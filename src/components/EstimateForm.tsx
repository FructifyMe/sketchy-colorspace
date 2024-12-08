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
import type { ClientInfo, EstimateItem, EstimateData } from '@/types/estimate';
import type { Json } from '@/integrations/supabase/types';

const EstimateForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState<EstimateData>({
    description: '',
    items: [],
    clientInfo: {
      name: '',
      address: '',
      phone: '',
      email: ''
    }
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
      description: data.description || prev.description,
      items: mappedItems.length > 0 ? mappedItems : prev.items,
      clientInfo: {
        ...prev.clientInfo,
        name: data.clientInfo?.name || prev.clientInfo.name,
        address: data.clientInfo?.address || prev.clientInfo.address,
        phone: data.clientInfo?.phone || prev.clientInfo.phone,
        email: data.clientInfo?.email || prev.clientInfo.email
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
      
      // Convert items and clientInfo to Json type for Supabase
      const itemsJson = formData.items as unknown as Json;
      const clientInfoJson = formData.clientInfo as unknown as Json;
      
      const { data, error } = await supabase
        .from('estimates')
        .insert({
          user_id: user.id,
          description: formData.description,
          items: itemsJson,
          client_info: clientInfoJson,
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
    <div className="container mx-auto px-4 py-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <EstimateFormActions isSubmitting={isSubmitting} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="space-y-6">
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
          </div>
          
          <div className="lg:col-span-1">
            <Card className="p-6">
              <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EstimateForm;