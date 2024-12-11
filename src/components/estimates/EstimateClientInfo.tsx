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
      <div className="space-y-4 print:space-y-2 text-left">
        <h2 className="text-lg font-semibold mb-4 print:text-lg print:mb-2">Client Information</h2>
        <div className="space-y-1 print:text-sm">
          {isEditing ? (
            <div className="space-y-2 print:space-y-1">
              <div className="text-left">
                <span className="text-base font-medium text-gray-600 print:text-sm">Name: </span>
                <Input
                  className="text-base mt-1 print:text-sm"
                  value={clientInfo?.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Client name"
                />
              </div>
              <div className="text-left">
                <span className="text-base font-medium text-gray-600 print:text-sm">Phone: </span>
                <Input
                  className="text-base mt-1 print:text-sm"
                  value={clientInfo?.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="Phone number"
                />
              </div>
              <div className="text-left">
                <span className="text-base font-medium text-gray-600 print:text-sm">Email: </span>
                <Input
                  className="text-base mt-1 print:text-sm"
                  value={clientInfo?.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Email address"
                />
              </div>
              <div className="text-left">
                <span className="text-base font-medium text-gray-600 print:text-sm">Address: </span>
                <Input
                  className="text-base mt-1 print:text-sm"
                  value={clientInfo?.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Address"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1 print:text-sm">
              <p className="text-left">Name: {clientInfo?.name || 'N/A'}</p>
              <p className="text-left">Phone: {clientInfo?.phone || 'N/A'}</p>
              <p className="text-left">Email: {clientInfo?.email || 'N/A'}</p>
              <p className="text-left">Address: {clientInfo?.address || 'N/A'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EstimateClientInfo;