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
      <div className="flex flex-col space-y-4 w-full">
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <Input
            value={clientInfo.name}
            onChange={handleChange('name')}
            placeholder="Client name"
            className="w-full max-w-2xl"
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <Input
            type="email"
            value={clientInfo.email}
            onChange={handleChange('email')}
            placeholder="client@example.com"
            className="w-full max-w-2xl"
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <Input
            value={clientInfo.phone}
            onChange={handleChange('phone')}
            placeholder="Phone number"
            className="w-full max-w-2xl"
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <Input
            value={clientInfo.address}
            onChange={handleChange('address')}
            placeholder="Client address"
            className="w-full max-w-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientInfoForm;