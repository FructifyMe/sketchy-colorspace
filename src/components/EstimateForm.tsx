import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VoiceRecorder from './VoiceRecorder';
import EstimateItemForm from './EstimateItemForm';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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

interface ClientInfo {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
}

interface EstimateData {
  description: string;
  items: EstimateItem[];
  clientInfo?: ClientInfo;
}

const EstimateForm = () => {
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

  const handleTranscriptionComplete = (data: EstimateData) => {
    console.log("Received transcription data:", data);
    
    // Update estimate data with transcribed information
    setEstimateData(prev => ({
      description: data.description || prev.description,
      items: data.items?.length ? [
        ...data.items,
        ...prev.items.slice(data.items.length)
      ] : prev.items,
      clientInfo: {
        ...prev.clientInfo,
        ...data.clientInfo
      }
    }));
    
    toast({
      title: "Transcription processed",
      description: "The estimate has been updated with the transcribed information",
    });
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
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Client Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <Input
                value={estimateData.clientInfo?.name || ''}
                onChange={(e) => setEstimateData(prev => ({
                  ...prev,
                  clientInfo: { ...prev.clientInfo, name: e.target.value }
                }))}
                placeholder="Client name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                value={estimateData.clientInfo?.email || ''}
                onChange={(e) => setEstimateData(prev => ({
                  ...prev,
                  clientInfo: { ...prev.clientInfo, email: e.target.value }
                }))}
                placeholder="client@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <Input
                value={estimateData.clientInfo?.phone || ''}
                onChange={(e) => setEstimateData(prev => ({
                  ...prev,
                  clientInfo: { ...prev.clientInfo, phone: e.target.value }
                }))}
                placeholder="Phone number"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Address</label>
              <Input
                value={estimateData.clientInfo?.address || ''}
                onChange={(e) => setEstimateData(prev => ({
                  ...prev,
                  clientInfo: { ...prev.clientInfo, address: e.target.value }
                }))}
                placeholder="Client address"
              />
            </div>
          </div>
        </div>

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