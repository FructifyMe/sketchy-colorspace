import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VoiceRecorder from './VoiceRecorder';
import EstimateItemForm from './EstimateItemForm';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
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

interface EstimateData {
  description: string;
  items: EstimateItem[];
}

const EstimateForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const template = location.state?.template as Template;
  const [estimateData, setEstimateData] = useState<EstimateData>({
    description: '',
    items: []
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
    // Initialize items based on template sections
    const initialItems = template.template_data.sections.map(() => ({
      name: '',
      quantity: undefined,
      price: undefined
    }));
    setEstimateData(prev => ({ ...prev, items: initialItems }));
  }, [template, navigate, toast]);

  const handleTranscriptionComplete = (data: EstimateData) => {
    setEstimateData(data);
    console.log("Estimate data updated:", data);
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
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <Textarea
            value={estimateData.description}
            onChange={(e) => setEstimateData(prev => ({
              ...prev,
              description: e.target.value
            }))}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Items</h3>
          {template.template_data.sections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h4 className="font-medium text-gray-700">{section.name}</h4>
              <EstimateItemForm
                key={index}
                item={estimateData.items[index] || { name: '', quantity: undefined, price: undefined }}
                index={index}
                onUpdate={handleUpdateItem}
                onRemove={handleRemoveItem}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setEstimateData(prev => ({
                ...prev,
                items: [...prev.items, { name: '', quantity: undefined, price: undefined }]
              }));
            }}
          >
            Add Item
          </Button>
        </div>

        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
          Save Estimate
        </Button>
      </form>
    </div>
  );
};

export default EstimateForm;