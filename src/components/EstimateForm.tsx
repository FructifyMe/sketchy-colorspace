import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import VoiceRecorder from './VoiceRecorder';
import ClientInfoForm from './estimates/ClientInfoForm';
import EstimateDescription from './estimates/EstimateDescription';
import EstimateItemsList from './estimates/EstimateItemsList';
import { useEstimateForm } from '@/hooks/useEstimateForm';

const EstimateForm = () => {
  const navigate = useNavigate();
  const {
    template,
    estimateData,
    setEstimateData,
    handleTranscriptionComplete,
    handleUpdateItem,
    handleRemoveItem,
    handleAddItem,
    handleSubmit
  } = useEstimateForm();

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