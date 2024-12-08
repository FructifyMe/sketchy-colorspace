import React from 'react';
import { Input } from "@/components/ui/input";
import type { ClientInfo } from '@/types/estimate';

interface ClientInfoFormProps {
  clientInfo: ClientInfo;
  onChange: (info: ClientInfo) => void;
}

const ClientInfoForm = ({ clientInfo, onChange }: ClientInfoFormProps) => {
  const handleChange = (field: keyof ClientInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...clientInfo,
      [field]: e.target.value
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Client Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Name</label>
          <Input
            value={clientInfo.name}
            onChange={handleChange('name')}
            placeholder="Client name"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <Input
            type="email"
            value={clientInfo.email}
            onChange={handleChange('email')}
            placeholder="client@example.com"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Phone</label>
          <Input
            value={clientInfo.phone}
            onChange={handleChange('phone')}
            placeholder="Phone number"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Address</label>
          <Input
            value={clientInfo.address}
            onChange={handleChange('address')}
            placeholder="Client address"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientInfoForm;