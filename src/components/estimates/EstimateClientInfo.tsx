import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ClientInfo {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface EstimateClientInfoProps {
  clientInfo: ClientInfo | null;
  onUpdateClientInfo?: (updates: ClientInfo) => void;
  isEditing?: boolean;
}

const EstimateClientInfo = ({ clientInfo, onUpdateClientInfo, isEditing = false }: EstimateClientInfoProps) => {
  const handleChange = (field: keyof ClientInfo, value: string) => {
    if (onUpdateClientInfo && clientInfo) {
      onUpdateClientInfo({
        ...clientInfo,
        [field]: value
      });
    }
  };

  return (
    <div className="print:mb-4">
      <h3 className="text-xs font-semibold mb-2">Client Information</h3>
      <div className="text-xs space-y-1">
        <div className="text-left">
          <span className="text-xs font-medium text-gray-600">Name: </span>
          {isEditing ? (
            <Input
              className="text-xs mt-1"
              value={clientInfo?.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Client name"
            />
          ) : (
            <span className="text-xs">{clientInfo?.name || 'N/A'}</span>
          )}
        </div>
        <div className="text-left">
          <span className="text-xs font-medium text-gray-600">Phone: </span>
          {isEditing ? (
            <Input
              className="text-xs mt-1"
              value={clientInfo?.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Phone number"
            />
          ) : (
            <span className="text-xs">{clientInfo?.phone || 'N/A'}</span>
          )}
        </div>
        <div className="text-left">
          <span className="text-xs font-medium text-gray-600">Email: </span>
          {isEditing ? (
            <Input
              className="text-xs mt-1"
              value={clientInfo?.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Email address"
            />
          ) : (
            <span className="text-xs">{clientInfo?.email || 'N/A'}</span>
          )}
        </div>
        <div className="text-left">
          <span className="text-xs font-medium text-gray-600">Address: </span>
          {isEditing ? (
            <Input
              className="text-xs mt-1"
              value={clientInfo?.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Address"
            />
          ) : (
            <span className="text-xs">{clientInfo?.address || 'N/A'}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EstimateClientInfo;