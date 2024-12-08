import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import VoiceRecorder from './VoiceRecorder';
import { useToast } from "@/components/ui/use-toast";

const EstimateForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({
    description: '',
    items: [] as Array<{ name: string; quantity?: number; price?: number }>,
  });

  const handleTranscriptionComplete = (data: any) => {
    console.log("Received transcription data:", data);
    
    if (!data) {
      console.error("No transcription data received");
      return;
    }

    // Update form with transcribed data
    setFormData({
      description: data.description || '',
      items: Array.isArray(data.items) ? data.items.map(item => ({
        name: item.name || '',
        quantity: item.quantity,
        price: item.price
      })) : []
    });

    toast({
      title: "Transcription complete",
      description: "Your estimate has been populated with the transcribed data",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting estimate:", formData);
    toast({
      title: "Success",
      description: "Estimate saved successfully",
    });
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
      
      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        <Card className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full min-h-[100px] p-2 border rounded-md"
                placeholder="Description of work..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Items
              </label>
              {formData.items.map((item, index) => (
                <div key={index} className="border p-4 rounded-md mb-2">
                  <p><strong>Item:</strong> {item.name}</p>
                  {item.quantity && <p><strong>Quantity:</strong> {item.quantity}</p>}
                  {item.price && <p><strong>Price:</strong> ${item.price}</p>}
                </div>
              ))}
              {formData.items.length === 0 && (
                <p className="text-gray-500 italic">No items added yet. Record your voice to add items.</p>
              )}
            </div>
          </div>
        </Card>

        <Button type="submit" className="w-full">
          Save Estimate
        </Button>
      </form>
    </div>
  );
};

export default EstimateForm;