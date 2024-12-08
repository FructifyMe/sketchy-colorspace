import React from 'react';

interface EstimateDescriptionProps {
  description: string;
  onChange: (description: string) => void;
}

const EstimateDescription = ({ description, onChange }: EstimateDescriptionProps) => {
  return (
    <div className="w-full">
      <label className="block text-xl font-semibold text-gray-900 mb-4 text-left">
        Description
      </label>
      <textarea
        value={description}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[150px] p-4 border rounded-md text-left resize-y"
        placeholder="Description of work..."
      />
    </div>
  );
};

export default EstimateDescription;