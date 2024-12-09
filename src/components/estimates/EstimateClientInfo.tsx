import type { EstimateClientInfo } from "@/types/estimateDetail";

interface EstimateClientInfoProps {
  clientInfo: EstimateClientInfo | null;
}

const EstimateClientInfo = ({ clientInfo }: EstimateClientInfoProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-sm font-semibold text-gray-600 mb-2">Bill To</h2>
      <div className="space-y-1">
        <p className="font-medium text-lg">{clientInfo?.name || 'N/A'}</p>
        <p className="text-gray-600">{clientInfo?.address || 'N/A'}</p>
        <p className="text-gray-600">{clientInfo?.phone || 'N/A'}</p>
        <p className="text-gray-600">{clientInfo?.email || 'N/A'}</p>
      </div>
    </div>
  );
};

export default EstimateClientInfo;