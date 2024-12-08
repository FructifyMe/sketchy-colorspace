import { Input } from "@/components/ui/input";

interface CompanyInfoFormProps {
  formData: {
    company_name: string;
    company_header: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    phone: string;
    email: string;
  };
  onChange: (field: string, value: string) => void;
}

const CompanyInfoForm = ({ formData, onChange }: CompanyInfoFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Company Name</label>
        <Input
          value={formData.company_name}
          onChange={(e) => onChange('company_name', e.target.value)}
          placeholder="Enter company name"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Company Header</label>
        <Input
          value={formData.company_header}
          onChange={(e) => onChange('company_header', e.target.value)}
          placeholder="Enter company header"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Address</label>
        <Input
          value={formData.address}
          onChange={(e) => onChange('address', e.target.value)}
          placeholder="Enter street address"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">City</label>
          <Input
            value={formData.city}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder="Enter city"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">State</label>
          <Input
            value={formData.state}
            onChange={(e) => onChange('state', e.target.value)}
            placeholder="Enter state"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">ZIP Code</label>
        <Input
          value={formData.zip_code}
          onChange={(e) => onChange('zip_code', e.target.value)}
          placeholder="Enter ZIP code"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Phone</label>
        <Input
          value={formData.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="Enter phone number"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="Enter email address"
        />
      </div>
    </div>
  );
};

export default CompanyInfoForm;