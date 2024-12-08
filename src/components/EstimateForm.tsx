import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import VoiceRecorder from './VoiceRecorder';
import { useToast } from "@/components/ui/use-toast";
import ClientInfoForm from './estimates/ClientInfoForm';
import type { ClientInfo } from '@/types/estimate';

const EstimateForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
    
    // Map the transcribed items to the correct format
    const mappedItems = Array.isArray(data.items) ? data.items.map(item => ({
      name: item.description || '',
      quantity: item.quantity || 1,
      price: item.unitPrice || item.price || 0
    })) : [];

    console.log("Mapped items:", mappedItems);
    
    // Update form with transcribed data
    setFormData(prev => ({
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
            {/* Client Information */}
            <ClientInfoForm
              clientInfo={formData.clientInfo}
              onChange={(info) => setFormData(prev => ({ ...prev, clientInfo: info }))}
            />

            {/* Description */}
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

            {/* Items */}
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