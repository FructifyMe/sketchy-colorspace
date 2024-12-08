import React from 'react';
import { Textarea } from "@/components/ui/textarea";

interface EstimateDescriptionProps {
  description: string;
  onChange: (description: string) => void;
}

const EstimateDescription = ({ description, onChange }: EstimateDescriptionProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Description
      </label>
      <Textarea
        value={description}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[100px]"
        placeholder="Describe the work to be done"
      />
    </div>
  );
};

export default EstimateDescription;