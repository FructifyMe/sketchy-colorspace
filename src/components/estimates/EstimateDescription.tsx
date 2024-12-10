interface EstimateDescriptionProps {
  description: string | null;
}

const EstimateDescription = ({ description }: EstimateDescriptionProps) => {
  return (
    <div className="print:mb-8">
      <h2 className="text-2xl font-semibold mb-4 print:text-xl">Estimate Details</h2>
      <p className="text-gray-700 print:text-sm">{description || 'No description provided'}</p>
    </div>
  );
};

export default EstimateDescription;