import { Card, CardContent } from "@/components/ui/card";

interface ClientInfo {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface EstimateClientInfoProps {
  clientInfo: ClientInfo | null;
}

const EstimateClientInfo = ({ clientInfo }: EstimateClientInfoProps) => {
  return (
    <div className="print:mb-4">
      <h3 className="text-sm font-semibold mb-2">Client Information</h3>
      <div className="text-sm space-y-1">
        <div className="text-left">
          <span className="text-sm font-medium text-gray-600">Name: </span>
          <span className="text-sm">{clientInfo?.name || 'N/A'}</span>
        </div>
        <div className="text-left">
          <span className="text-sm font-medium text-gray-600">Phone: </span>
          <span className="text-sm">{clientInfo?.phone || 'N/A'}</span>
        </div>
        <div className="text-left">
          <span className="text-sm font-medium text-gray-600">Email: </span>
          <span className="text-sm">{clientInfo?.email || 'N/A'}</span>
        </div>
        <div className="text-left">
          <span className="text-sm font-medium text-gray-600">Address: </span>
          <span className="text-sm">{clientInfo?.address || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default EstimateClientInfo;