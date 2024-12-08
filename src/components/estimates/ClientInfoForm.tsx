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
    <div className="w-full">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Client Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <Input
            value={clientInfo.name}
            onChange={handleChange('name')}
            placeholder="Client name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <Input
            type="email"
            value={clientInfo.email}
            onChange={handleChange('email')}
            placeholder="client@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <Input
            value={clientInfo.phone}
            onChange={handleChange('phone')}
            placeholder="Phone number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
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