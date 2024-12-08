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
      <h3 className="text-xl font-semibold text-gray-900 mb-6 text-left">Client Information</h3>
      <div className="grid gap-6 w-full">
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Name</label>
          <Input
            value={clientInfo.name}
            onChange={handleChange('name')}
            placeholder="Client name"
            className="w-full text-left"
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Email</label>
          <Input
            type="email"
            value={clientInfo.email}
            onChange={handleChange('email')}
            placeholder="client@example.com"
            className="w-full text-left"
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Phone</label>
          <Input
            value={clientInfo.phone}
            onChange={handleChange('phone')}
            placeholder="Phone number"
            className="w-full text-left"
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Address</label>
          <Input
            value={clientInfo.address}
            onChange={handleChange('address')}
            placeholder="Client address"
            className="w-full text-left"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientInfoForm;