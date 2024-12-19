import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EstimateClientInfo } from '@/types/estimateDetail';

interface ClientInfoFormProps {
  clientInfo: EstimateClientInfo;
  onChange: (info: EstimateClientInfo) => void;
}

const ClientInfoForm = ({ clientInfo, onChange }: ClientInfoFormProps) => {
  const handleChange = (field: keyof EstimateClientInfo, value: string) => {
    onChange({
      ...clientInfo,
      [field]: value
    });
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <h3 className="text-lg sm:text-xl font-semibold">Client Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="client-name">Name</Label>
          <Input
            id="client-name"
            value={clientInfo.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Client name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client-phone">Phone</Label>
          <Input
            id="client-phone"
            value={clientInfo.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="Phone number"
            type="tel"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client-email">Email</Label>
          <Input
            id="client-email"
            value={clientInfo.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Email address"
            type="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client-address">Address</Label>
          <Input
            id="client-address"
            value={clientInfo.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Client address"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientInfoForm;