import React, { useState } from 'react';
import VoiceRecorder from './VoiceRecorder';
import EstimateItemForm from './EstimateItemForm';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

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
  const [estimateData, setEstimateData] = useState<EstimateData>({
    description: '',
    items: []
  });
  const { toast } = useToast();

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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Estimate</h2>
      
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
          {estimateData.items.map((item, index) => (
            <EstimateItemForm
              key={index}
              item={item}
              index={index}
              onUpdate={handleUpdateItem}
              onRemove={handleRemoveItem}
            />
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