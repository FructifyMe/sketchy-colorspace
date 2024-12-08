import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

interface EstimateFormActionsProps {
  isSubmitting: boolean;
}

const EstimateFormActions = ({ isSubmitting }: EstimateFormActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-900">Create New Estimate</h2>
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Estimate'}
        </Button>
      </div>
    </div>
  );
};

export default EstimateFormActions;