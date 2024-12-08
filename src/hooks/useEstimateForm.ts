import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";
import type { EstimateData, TranscriptionResult } from '@/types/estimate';

type Template = Database['public']['Tables']['templates']['Row'] & {
  template_data: {
    sections: {
      name: string;
      fields: string[];
    }[];
  };
};

export const useEstimateForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const template = location.state?.template as Template;
  const [estimateData, setEstimateData] = useState<EstimateData>({
    description: '',
    items: [],
    clientInfo: {
      name: '',
      address: '',
      phone: '',
      email: ''
    }
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

  const handleTranscriptionComplete = (data: TranscriptionResult) => {
    console.log("Handling transcription data:", data);
    
    if (!data) {
      console.error("No transcription data received");
      return;
    }

    const newEstimateData: EstimateData = {
      description: data.description || '',
      items: Array.isArray(data.items) && data.items.length > 0 
        ? data.items.map(item => ({
            name: item.name || '',
            quantity: typeof item.quantity === 'number' ? item.quantity : undefined,
            price: typeof item.price === 'number' ? item.price : undefined
          }))
        : estimateData.items,
      clientInfo: {
        ...estimateData.clientInfo,
        ...(data.clientInfo || {})
      }
    };

    console.log("Setting new estimate data:", newEstimateData);
    setEstimateData(newEstimateData);

    toast({
      title: "Transcription complete",
      description: "Form has been populated with the transcribed data",
    });
  };

  const handleUpdateItem = (index: number, updatedItem: EstimateData['items'][0]) => {
    console.log("Updating item at index:", index, "with:", updatedItem);
    const newItems = [...estimateData.items];
    newItems[index] = updatedItem;
    setEstimateData(prev => ({ ...prev, items: newItems }));
  };

  const handleRemoveItem = (index: number) => {
    console.log("Removing item at index:", index);
    const newItems = estimateData.items.filter((_, i) => i !== index);
    setEstimateData(prev => ({ ...prev, items: newItems }));
  };

  const handleAddItem = () => {
    console.log("Adding new item");
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

  return {
    template,
    estimateData,
    setEstimateData,
    handleTranscriptionComplete,
    handleUpdateItem,
    handleRemoveItem,
    handleAddItem,
    handleSubmit
  };
};