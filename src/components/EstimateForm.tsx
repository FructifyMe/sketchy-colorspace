import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import VoiceRecorder from './VoiceRecorder';
import ClientInfoForm from './estimates/ClientInfoForm';
import EstimateItems from './estimates/EstimateItems';
import EstimateDescription from './estimates/EstimateDescription';
import { supabase } from "@/integrations/supabase/client";
import type { ClientInfo, EstimateItem, EstimateData } from '@/types/estimate';

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
      
      const { data, error } = await supabase
        .from('estimates')
        .insert({
          user_id: user.id,
          description: formData.description,
          items: formData.items,
          client_info: formData.clientInfo,
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
    <div className="mx-8 py-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-8">
          <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />
        </Card>

        <Card className="p-8">
          <ClientInfoForm
            clientInfo={formData.clientInfo}
            onChange={(info) => setFormData(prev => ({ ...prev, clientInfo: info }))}
          />
        </Card>

        <Card className="p-8">
          <EstimateDescription
            description={formData.description}
            onChange={(description) => setFormData(prev => ({ ...prev, description }))}
          />
        </Card>

        <Card className="p-8">
          <EstimateItems items={formData.items} />
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Estimate'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EstimateForm;
