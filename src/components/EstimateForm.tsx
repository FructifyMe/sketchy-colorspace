import React, { useState } from 'react';
import VoiceRecorder from './VoiceRecorder';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the estimate
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
            <div key={index} className="flex gap-4 items-start p-4 border rounded-lg">
              <div className="flex-1">
                <Input
                  value={item.name}
                  onChange={(e) => {
                    const newItems = [...estimateData.items];
                    newItems[index] = { ...item, name: e.target.value };
                    setEstimateData(prev => ({ ...prev, items: newItems }));
                  }}
                  placeholder="Item name"
                  className="mb-2"
                />
                <div className="flex gap-4">
                  <Input
                    type="number"
                    value={item.quantity || ''}
                    onChange={(e) => {
                      const newItems = [...estimateData.items];
                      newItems[index] = { ...item, quantity: parseInt(e.target.value) };
                      setEstimateData(prev => ({ ...prev, items: newItems }));
                    }}
                    placeholder="Quantity"
                  />
                  <Input
                    type="number"
                    value={item.price || ''}
                    onChange={(e) => {
                      const newItems = [...estimateData.items];
                      newItems[index] = { ...item, price: parseFloat(e.target.value) };
                      setEstimateData(prev => ({ ...prev, items: newItems }));
                    }}
                    placeholder="Price"
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  const newItems = estimateData.items.filter((_, i) => i !== index);
                  setEstimateData(prev => ({ ...prev, items: newItems }));
                }}
              >
                Remove
              </Button>
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