import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import VoiceRecorder from './VoiceRecorder';
import ClientInfoForm from './estimates/ClientInfoForm';
import EstimateDescription from './estimates/EstimateDescription';
import EstimateItemsList from './estimates/EstimateItemsList';
import type { Database } from "@/integrations/supabase/types";

type Template = Database['public']['Tables']['templates']['Row'] & {
  template_data: {
    sections: {
      name: string;
      fields: string[];
    }[];
  };
};

interface EstimateItem {
  name: string;
  quantity?: number;
  price?: number;
}

interface ClientInfo {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
}

interface EstimateData {
  description: string;
  items: EstimateItem[];
  clientInfo: ClientInfo;
}

const EstimateForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const template = location.state?.template as Template;
  const [estimateData, setEstimateData] = useState<EstimateData>({
    description: '',
    items: [],
    clientInfo: {}
  });
  const { toast } = useToast();

  useEffect(() => {
    if (!template) {
      toast({
        title: "No template selected",
        description: "Please select a template from the dashboard",
        variant: "destructive"
      });
      navigate('/dashboard');
      return;
    }

    console.log("Initializing estimate form with template:", template);
    const initialItems = template.template_data.sections.map(() => ({
      name: '',
      quantity: undefined,
      price: undefined
    }));
    setEstimateData(prev => ({ ...prev, items: initialItems }));
  }, [template, navigate, toast]);

  const handleTranscriptionComplete = (data: any) => {
    console.log("Handling transcription data:", data);
    
    setEstimateData(prev => ({
      description: data.description || data.transcriptionText || prev.description,
      items: data.items?.length ? [
        ...data.items,
        ...prev.items.slice(data.items.length)
      ] : prev.items,
      clientInfo: {
        ...prev.clientInfo,
        ...data.clientInfo
      }
    }));
  };

  const handleUpdateItem = (index: number, updatedItem: EstimateItem) => {
    const newItems = [...estimateData.items];
    newItems[index] = updatedItem;
    setEstimateData(prev => ({ ...prev, items: newItems }));
  };

  const handleRemoveItem = (index: number) => {
    const newItems = estimateData.items.filter((_, i) => i !== index);
    setEstimateData(prev => ({ ...prev, items: newItems }));
  };

  const handleAddItem = () => {
    setEstimateData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: undefined, price: undefined }]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting estimate:", estimateData);
    toast({
      title: "Estimate saved",
      description: "Your estimate has been saved successfully",
    });
  };

  if (!template) {
    return null;
  }

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
      
      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        <ClientInfoForm 
          clientInfo={estimateData.clientInfo}
          onChange={(clientInfo) => setEstimateData(prev => ({ ...prev, clientInfo }))}
        />

        <EstimateDescription
          description={estimateData.description}
          onChange={(description) => setEstimateData(prev => ({ ...prev, description }))}
        />

        <EstimateItemsList
          items={estimateData.items}
          onUpdateItem={handleUpdateItem}
          onRemoveItem={handleRemoveItem}
          onAddItem={handleAddItem}
          sections={template.template_data.sections}
        />

        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
          Save Estimate
        </Button>
      </form>
    </div>
  );
};

export default EstimateForm;