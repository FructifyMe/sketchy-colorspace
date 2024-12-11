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
      <h3 className="text-base font-semibold mb-3 text-left print:text-sm print:mb-2">Client Information</h3>
      <div className="text-base space-y-2 print:text-xs print:space-y-1">
        <div className="text-left">
          <span className="text-base font-medium text-gray-600 print:text-xs">Name: </span>
          {isEditing ? (
            <Input
              className="text-base mt-1 print:text-xs"
              value={clientInfo?.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Client name"
            />
          ) : (
            <span className="text-base print:text-xs">{clientInfo?.name || 'N/A'}</span>
          )}
        </div>
        <div className="text-left">
          <span className="text-base font-medium text-gray-600 print:text-xs">Phone: </span>
          {isEditing ? (
            <Input
              className="text-base mt-1 print:text-xs"
              value={clientInfo?.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Phone number"
            />
          ) : (
            <span className="text-base print:text-xs">{clientInfo?.phone || 'N/A'}</span>
          )}
        </div>
        <div className="text-left">
          <span className="text-base font-medium text-gray-600 print:text-xs">Email: </span>
          {isEditing ? (
            <Input
              className="text-base mt-1 print:text-xs"
              value={clientInfo?.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Email address"
            />
          ) : (
            <span className="text-base print:text-xs">{clientInfo?.email || 'N/A'}</span>
          )}
        </div>
        <div className="text-left">
          <span className="text-base font-medium text-gray-600 print:text-xs">Address: </span>
          {isEditing ? (
            <Input
              className="text-base mt-1 print:text-xs"
              value={clientInfo?.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Address"
            />
          ) : (
            <span className="text-base print:text-xs">{clientInfo?.address || 'N/A'}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EstimateClientInfo;