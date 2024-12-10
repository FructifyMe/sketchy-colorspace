interface EstimateDescriptionProps {
  description: string | null;
  onChange?: (description: string) => void;
}

const EstimateDescription = ({ description, onChange }: EstimateDescriptionProps) => {
  if (onChange) {
    return (
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          value={description || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-[100px] p-2 border rounded-md"
          placeholder="Enter estimate description..."
        />
      </div>
    );
  }

  return (
    <div className="print:mb-8">
      <h2 className="text-2xl font-semibold mb-4 print:text-xl">Estimate Details</h2>
      <p className="text-gray-700 print:text-sm">{description || 'No description provided'}</p>
    </div>
  );
};

export default EstimateDescription;