import React from 'react';

interface EstimateDescriptionProps {
  description: string;
  onChange: (description: string) => void;
}

const EstimateDescription = ({ description, onChange }: EstimateDescriptionProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Description
      </label>
      <textarea
        value={description}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[100px] p-2 border rounded-md"
        placeholder="Description of work..."
      />
    </div>
  );
};

export default EstimateDescription;