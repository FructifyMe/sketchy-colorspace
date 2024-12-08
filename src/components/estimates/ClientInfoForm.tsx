import React from 'react';
import { Input } from "@/components/ui/input";

interface ClientInfo {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
}

interface ClientInfoFormProps {
  clientInfo: ClientInfo;
  onChange: (info: ClientInfo) => void;
}

const ClientInfoForm = ({ clientInfo, onChange }: ClientInfoFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Client Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Name</label>
          <Input
            value={clientInfo?.name || ''}
            onChange={(e) => onChange({ ...clientInfo, name: e.target.value })}
            placeholder="Client name"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <Input
            type="email"
            value={clientInfo?.email || ''}
            onChange={(e) => onChange({ ...clientInfo, email: e.target.value })}
            placeholder="client@example.com"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Phone</label>
          <Input
            value={clientInfo?.phone || ''}
            onChange={(e) => onChange({ ...clientInfo, phone: e.target.value })}
            placeholder="Phone number"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Address</label>
          <Input
            value={clientInfo?.address || ''}
            onChange={(e) => onChange({ ...clientInfo, address: e.target.value })}
            placeholder="Client address"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientInfoForm;